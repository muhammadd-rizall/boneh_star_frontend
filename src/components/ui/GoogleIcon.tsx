interface GoogleIconProps {
  className?: string;
}

export function GoogleIcon({ className = "size-5" }: GoogleIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3.01h3.89c2.27-2.09 3.53-5.17 3.53-8.88Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.89-3.01c-1.08.72-2.46 1.15-4.04 1.15-3.12 0-5.77-2.11-6.72-4.95H1.27v3.11A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29a7.22 7.22 0 0 1 0-4.58V6.6H1.27a11.99 11.99 0 0 0 0 10.8l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.35.61 4.6 1.8l3.43-3.43A11.48 11.48 0 0 0 12 0 11.99 11.99 0 0 0 1.27 6.6l4.01 3.11C6.23 6.87 8.88 4.76 12 4.76Z"
      />
    </svg>
  );
}
