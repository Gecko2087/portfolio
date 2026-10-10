const projects = {
  helpdesk: {title:'HelpDesk IA',intro:'An IT support ticket system with AI assistance, developed as a final course project.',problem:'IT incidents need a description, category and priority before they can be resolved. This project brings AI assistance into that workflow.',solution:'A React interface supports ticket creation and review. The Express backend validates input with Zod, stores data through Prisma and requests category, priority and suggested steps from Gemini.',decisions:['AI integration runs on the backend to keep the API key out of the client.','Demo mode returns simulated responses when no API key is configured or the provider fails.','PostgreSQL for deployment and SQLite for local testing, as described in the project documentation.'],evidence:'Demonstrates external service integration, input validation and a complete interface, API and persistence workflow. Demo responses illustrate the flow and are not live AI inference.',links:[['Repository','https://github.com/Gecko2087/helpdesk-ia'],['Interactive preview','lab-en.html?project=helpdesk']]},
  passforge:{title:'PassForge',intro:'A password generation and organization app, developed as a final Next.js and Prisma course project.',problem:'Managing multiple accounts requires generating passwords and organizing records for each user.',solution:'A Next.js app with TypeScript, categories, Better Auth sessions and PostgreSQL persistence through Prisma.',decisions:['Next.js App Router with integrated API endpoints.','Related user, session, category and password models managed with Prisma.','Interface components built with Tailwind and Radix UI.'],evidence:'Demonstrates relational modeling, user sessions and application development with TypeScript. This is a learning project; the presentation does not certify its security or recommend storing real credentials.',links:[['Repository','https://github.com/Gecko2087/passforge-nextjs-prisma'],['Interactive preview','lab-en.html?project=passforge']]},
  gamerhub:{title:'GamerHub',intro:'A platform for connecting players, with separate frontend and backend repositories.',problem:'A gaming community needs profiles, game information and user authentication.',solution:'A React client connects to an Express API with authentication, user, profile and game routes. The backend uses Mongoose and MongoDB.',decisions:['Separate client and server applications keep responsibilities clear.','JWT authentication and bcryptjs on the backend.','Resource-based endpoints for users, profiles and games.'],evidence:'Demonstrates integration with an independent API, route organization and a document database. The interactive preview is a separate in-memory catalog and favorites experience, without a connection to the original backend.',links:[['Frontend','https://github.com/Gecko2087/gamerhub-frontend'],['Backend','https://github.com/Gecko2087/gamerhub-backend'],['Interactive preview','lab-en.html?project=gamerhub']]},
  taskapi:{title:'Task API',intro:'User-based task management with a Laravel API and a Vue client.',problem:'Task management requires separating administrative operations from actions available to each user.',solution:'A REST API exposes CRUD operations for users and tasks. Admin and employee routes use Sanctum authentication and role middleware.',decisions:['Route groups protected by auth:sanctum middleware.','Separate administrator and employee access.','Laravel backend and Vue frontend organized as separate applications.'],evidence:'Demonstrates endpoint design, authentication and role-based permissions. The interactive preview provides a board and role views using fictional data. API responses are simulated; backend authentication and authorization do not run in that edition.',links:[['Repository','https://github.com/Gecko2087/task-rest-api'],['Interactive preview','lab-en.html?project=taskapi']]}
};
const dialog=document.querySelector('#case-dialog');
const content=document.querySelector('#case-content');
let lastTrigger;
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
 const p=projects[button.dataset.project];lastTrigger=button;
 content.replaceChildren();
 const add=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;content.append(el);return el;};
 add('h2',p.title).id='case-title';add('p',p.intro);add('h3','The problem');add('p',p.problem);add('h3','The solution');add('p',p.solution);add('h3','Technical decisions');const ul=add('ul','');p.decisions.forEach(text=>{const li=document.createElement('li');li.textContent=text;ul.append(li);});add('h3','What it demonstrates');add('p',p.evidence);
 const links=add('div','');links.className='dialog-links';p.links.forEach(([text,url])=>{const a=document.createElement('a');a.href=url;a.textContent=text+' ↗';a.className='button primary';a.target='_blank';a.rel='noopener noreferrer';links.append(a);});
 add('p','The architecture describes the original project. The interactive preview is a separate recruiter edition with fictional data and clear explanations of the services it simulates.').className='source-note';
 dialog.showModal();document.body.style.overflow='hidden';
}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';lastTrigger?.focus();});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});let count=0;document.querySelectorAll('.project').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&!card.dataset.tags.split(' ').includes(button.dataset.filter);if(!card.hidden)count++;});document.querySelector('#filter-status').textContent=`${count} projects visible`; }));
document.querySelector('#year').textContent=new Date().getFullYear();

const layers = {
 interface: { title: 'A clear experience.', copy: 'I design flows, states and actions that help people complete a task.', link: 'Explore an interface ↗', demo: 'gamerhub' },
 logic: { title: 'Rules with context.', copy: 'I organize services, validation and permissions. Each case explains the decisions behind the flow.', link: 'Explore a role-based flow ↗', demo: 'taskapi' },
 data: { title: 'Data that connects.', copy: 'I model information and connect APIs. Explore a support flow with classification, priorities and status changes.', link: 'Explore tickets ↗', demo: 'helpdesk' }
};
document.querySelectorAll('[data-layer]').forEach(button=>button.addEventListener('click',()=>{
 const layer=layers[button.dataset.layer];
 document.querySelectorAll('[data-layer]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 document.querySelector('#layer-title').textContent=layer.title;document.querySelector('#layer-copy').textContent=layer.copy;
 document.querySelector('#layer-link').textContent=layer.link;document.querySelector('#layer-link').href=`lab-en.html?project=${layer.demo}`;
}));
const roles = {
 fullstack: { label:'FROM FLOW TO PERSISTENCE',title:'Interfaces that connect to services.',copy:'React, Next.js, Node.js and Laravel. Project cases explain the architecture; previews let you explore workflows with fictional data.',demo:'helpdesk',name:'HelpDesk IA' },
 backend: { label:'ENDPOINTS, MODELS AND RESPONSIBILITIES',title:'Logic is part of the product.',copy:'Node.js and Laravel APIs, relational and document models. Task API shows task and role views in an interactive simulation; its case explains the original backend.',demo:'taskapi',name:'Task API' },
 ai: { label:'DEVELOPMENT WITH OPERATIONAL EXPERIENCE',title:'AI within a workflow.',copy:'I integrate AI and automation into operational processes. HelpDesk illustrates classification and human review with simulated analysis; my experience includes internal quality and reporting tools.',demo:'helpdesk',name:'HelpDesk IA' }
};
document.querySelectorAll('[data-role]').forEach(button=>button.addEventListener('click',()=>{
 const role=roles[button.dataset.role];document.querySelectorAll('[data-role]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 document.querySelector('#role-label').textContent=role.label;document.querySelector('#role-title').textContent=role.title;document.querySelector('#role-copy').textContent=role.copy;
 document.querySelector('#role-demo').textContent=`Explore ${role.name} ↗`;document.querySelector('#role-demo').href=`lab-en.html?project=${role.demo}`;
}));
