const spanish = [
  {
    id: 'people', title: 'Empleados', role: 'Vista de gestión', headline: 'Directorio de empleados',
    description: 'Consultar quién integra cada equipo y a qué área pertenece.',
    items: [['Alex Demostración', 'Agente · Atención'], ['Sol Ejemplo', 'Supervisión · Atención'], ['Cris Muestra', 'Agente · Operaciones']],
  },
  {
    id: 'documents', title: 'Certificados', role: 'Vista de empleado', headline: 'Presentación de certificados',
    description: 'Adjuntar un certificado y consultar los documentos ya presentados.',
    items: [['Certificado de ejemplo', 'Presentado · Documento ficticio'], ['Nueva presentación', 'Adjuntar documento']],
  },
  {
    id: 'notices', title: 'Llamados de atención', role: 'Vista de gestión', headline: 'Registro de llamados de atención',
    description: 'Cargar un llamado de atención desde el área autorizada.',
    items: [['Registro de ejemplo', 'Documento ficticio · Vista de gestión']],
  },
  {
    id: 'birthdays', title: 'Cumpleaños', role: 'Vista de empleado', headline: 'Cumpleaños del equipo',
    description: 'Consultar los cumpleaños y felicitar a una persona desde la intranet.',
    items: [['Sol Ejemplo', 'Hoy · Felicitación de ejemplo'], ['Alex Demostración', 'Próximamente']],
  },
  {
    id: 'supervision', title: 'Coaching y monitoreos', role: 'Vista de supervisión', headline: 'Seguimiento de agentes',
    description: 'Registrar el coaching y los monitoreos de la atención de los agentes.',
    items: [['Coaching de Alex Demostración', 'Tema de ejemplo · Cierre de la interacción'], ['Monitoreo de Cris Muestra', 'Tema de ejemplo · Seguimiento de la consulta']],
  },
  {
    id: 'planning', title: 'Planificación', role: 'Vista de supervisión', headline: 'Planificación de tareas',
    description: 'Organizar las tareas de seguimiento del equipo y programar actividades de supervisión.',
    items: [['09:30 · Monitoreo de una interacción', 'Agendado · Ejemplo'], ['14:00 · Sesión de coaching', 'Agendado · Ejemplo']],
  },
  {
    id: 'payroll', title: 'Recibos de sueldo', role: 'Vista de empleado', headline: 'Mis recibos de sueldo',
    description: 'Consultar los recibos propios desde la cuenta del empleado.',
    items: [['Recibo de ejemplo', 'Octubre · Documento ficticio']],
  },
];

const english = [
  {
    id: 'people', title: 'Employees', role: 'Management view', headline: 'Employee directory',
    description: 'See who is on each team and which department they belong to.',
    items: [['Alex Demo', 'Agent · Customer service'], ['Sol Example', 'Supervisor · Customer service'], ['Cris Sample', 'Agent · Operations']],
  },
  {
    id: 'documents', title: 'Certificates', role: 'Employee view', headline: 'Certificate submissions',
    description: 'Attach a certificate and review previously submitted documents.',
    items: [['Sample certificate', 'Submitted · Fictional document'], ['New submission', 'Attach document']],
  },
  {
    id: 'notices', title: 'Formal warnings', role: 'Management view', headline: 'Formal warning records',
    description: 'Record a formal warning from the authorized management area.',
    items: [['Sample record', 'Fictional document · Management view']],
  },
  {
    id: 'birthdays', title: 'Birthdays', role: 'Employee view', headline: 'Team birthdays',
    description: 'See team birthdays and send congratulations through the intranet.',
    items: [['Sol Example', 'Today · Sample message'], ['Alex Demo', 'Coming up']],
  },
  {
    id: 'supervision', title: 'Coaching and monitoring', role: 'Supervisor view', headline: 'Agent development',
    description: 'Log coaching sessions and reviews of agent interactions.',
    items: [['Coaching for Alex Demo', 'Sample topic · Closing the interaction'], ['Review for Cris Sample', 'Sample topic · Following up on an inquiry']],
  },
  {
    id: 'planning', title: 'Task planning', role: 'Supervisor view', headline: 'Supervisor task planning',
    description: 'Organize team follow-up tasks and schedule supervision activities.',
    items: [['09:30 · Review an interaction', 'Scheduled · Example'], ['14:00 · Coaching session', 'Scheduled · Example']],
  },
  {
    id: 'payroll', title: 'Payslips', role: 'Employee view', headline: 'My payslips',
    description: 'Review your own payslips from your employee account.',
    items: [['Sample payslip', 'October · Fictional document']],
  },
];

export const intranetModules = { es: spanish, en: english };
