"""Local recovery drill using synthetic data only. Python standard library."""
from contextlib import closing
import hashlib
import json
import shutil
import sqlite3
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_service(path):
    # Open the restored database read-only, as a small service read would.
    with closing(sqlite3.connect(path.as_uri() + "?mode=ro", uri=True)) as connection:
        assert connection.execute("PRAGMA integrity_check").fetchone()[0] == "ok"
        result = connection.execute(
            "SELECT count(*), sum(amount_cents), sum(status = 'open') FROM tickets"
        ).fetchone()
        assert result == (10000, 50005000, 3333), result
        assert connection.execute(
            "SELECT customer, status FROM tickets WHERE id = 42"
        ).fetchone() == ("Synthetic customer 42", "open")
        return result


def main():
    with tempfile.TemporaryDirectory(prefix="portfolio-recovery-") as directory:
        root = Path(directory)
        source, backup, restored = (root / name for name in ("source.db", "backup.db", "restored.db"))
        with closing(sqlite3.connect(source)) as connection:
            connection.execute("CREATE TABLE tickets (id INTEGER PRIMARY KEY, customer TEXT, status TEXT, amount_cents INTEGER)")
            connection.executemany("INSERT INTO tickets VALUES (?, ?, ?, ?)", (
                (i, f"Synthetic customer {i}", "open" if i % 3 == 0 else "closed", i)
                for i in range(1, 10001)
            ))
            connection.commit()
            with closing(sqlite3.connect(backup)) as target:
                connection.backup(target)
        read_service(backup)
        expected_hash = digest(backup)
        source.rename(root / "unavailable.db")
        assert not source.exists()
        start = time.perf_counter()
        shutil.copyfile(backup, restored)
        assert digest(restored) == expected_hash
        count, amount, open_count = read_service(restored)
        elapsed = time.perf_counter() - start
        # Negative control: corrupt a separate copy; the integrity gate must reject it.
        damaged = root / "damaged.db"
        shutil.copyfile(backup, damaged)
        with damaged.open("r+b") as handle:
            handle.write(b"BROKEN DATABASE!")
        assert digest(damaged) != expected_hash
        try:
            read_service(damaged)
        except sqlite3.DatabaseError:
            pass
        else:
            raise AssertionError("Corruption was not rejected")
        print(json.dumps({
            "checked_at_utc": datetime.now(timezone.utc).isoformat(),
            "sqlite_version": sqlite3.sqlite_version,
            "rows": count, "open_tickets": open_count, "amount_cents": amount,
            "backup_bytes": backup.stat().st_size,
            "sha256_equal": True, "integrity_check": "ok", "functional_read": "passed",
            "corruption_rejected": True, "recovery_seconds": round(elapsed, 6),
            "timing_scope": "local copy + SHA-256 + integrity check + read-only queries",
        }, indent=2))


if __name__ == "__main__":
    main()
