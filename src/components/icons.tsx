import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;
export type IconComponent = (props: IconProps) => ReactNode;

/** Stroke icons on a 24px grid; decorative by default. */
function createIcon(displayName: string, paths: ReactNode): IconComponent {
  function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {paths}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

export const MenuIcon = createIcon(
  "MenuIcon",
  <path d="M4 7h16M4 12h16M4 17h16" />,
);

export const CloseIcon = createIcon("CloseIcon", <path d="M6 6l12 12M18 6L6 18" />);

export const ChevronsLeftIcon = createIcon(
  "ChevronsLeftIcon",
  <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />,
);

export const ArrowLeftIcon = createIcon("ArrowLeftIcon", <path d="M19 12H5M12 19l-7-7 7-7" />);

export const PlusIcon = createIcon("PlusIcon", <path d="M12 5v14M5 12h14" />);

export const TrashIcon = createIcon(
  "TrashIcon",
  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
);

export const EyeIcon = createIcon(
  "EyeIcon",
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);

export const ReceiptIcon = createIcon(
  "ReceiptIcon",
  <path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21zM9 8h6M9 12h6M9 16h3" />,
);

export const PercentIcon = createIcon(
  "PercentIcon",
  <>
    <path d="M19 5L5 19" />
    <circle cx="7" cy="7" r="2.5" />
    <circle cx="17" cy="17" r="2.5" />
  </>,
);

export const StoreIcon = createIcon(
  "StoreIcon",
  <path d="M4 10v11h16V10M2.5 10L4.5 4h15l2 6zM10 21v-5h4v5" />,
);

export const UsersIcon = createIcon(
  "UsersIcon",
  <>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5a6.5 6.5 0 0 1 3 5.5" />
  </>,
);

export const BoxIcon = createIcon(
  "BoxIcon",
  <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5L12 12l9-4.5M12 12v9" />,
);

export const FileTextIcon = createIcon(
  "FileTextIcon",
  <path d="M14 3H6v18h12V7zM14 3v4h4M9 12h6M9 16h6" />,
);
