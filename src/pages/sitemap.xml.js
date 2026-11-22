import { caseKeys, casePath } from '../data/cases';
import { channelsPaths } from '../data/contact-channels';

export function GET({ site }) {
  const paths = [
    '/', '/en',
    ...caseKeys.flatMap(key => [casePath('es', key), casePath('en', key)]),
    '/proyectos/revision-calidad', '/en/projects/quality-review',
    '/proyectos/control-informes', '/en/projects/reporting',
    '/proyectos/intranet-operaciones', '/en/projects/operations-intranet',
    '/proyectos/recuperacion-servicio', '/en/projects/service-recovery',
    ...Object.values(channelsPaths),
  ];
  const entries = paths.map(path => '<url><loc>' + new URL(path, site).href + '</loc></url>');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + entries.join('') + '</urlset>', {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
