import {
  siCss,
  siDocker,
  siFastapi,
  siFigma,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siKotlin,
  siLaravel,
  siNextdotjs,
  siPhp,
  siPostgresql,
  siPython,
  siReact
} from 'simple-icons';

export type TechIconId =
  | 'python'
  | 'javascript'
  | 'kotlin'
  | 'php'
  | 'htmlcss'
  | 'react'
  | 'nextjs'
  | 'laravel'
  | 'fastapi'
  | 'sql'
  | 'postgresql'
  | 'figma'
  | 'adobe'
  | 'docker'
  | 'github';

const singleIconMap: Partial<Record<TechIconId, string>> = {
  python: siPython.path,
  javascript: siJavascript.path,
  kotlin: siKotlin.path,
  php: siPhp.path,
  react: siReact.path,
  nextjs: siNextdotjs.path,
  laravel: siLaravel.path,
  fastapi: siFastapi.path,
  postgresql: siPostgresql.path,
  figma: siFigma.path,
  docker: siDocker.path
};

interface TechIconProps {
  id: TechIconId;
}

export function TechIcon({ id }: TechIconProps) {
  if (id === 'htmlcss') {
    return (
      <span className="stack-icon-dual" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" focusable="false">
          <path d={siHtml5.path} />
        </svg>
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" focusable="false">
          <path d={siCss.path} />
        </svg>
      </span>
    );
  }

  if (id === 'github') {
    return (
      <span className="stack-icon-dual" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" focusable="false">
          <path d={siGit.path} />
        </svg>
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" focusable="false">
          <path d={siGithub.path} />
        </svg>
      </span>
    );
  }

  if (id === 'adobe') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425h-3.71zM8.884 1.376H0v21.248L8.884 1.376zm15.116 0h-8.884L24 22.624V1.376z" />
      </svg>
    );
  }

  if (id === 'sql') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
        <path d="M4.5 5.5v13c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-13" />
        <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" />
      </svg>
    );
  }

  const path = singleIconMap[id];
  if (!path) return null;

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true" focusable="false">
      <path d={path} />
    </svg>
  );
}
