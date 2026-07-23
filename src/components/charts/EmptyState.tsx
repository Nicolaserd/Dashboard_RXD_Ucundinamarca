import { Icon } from "@/components/ui/Icon";

/** Estado vacío informativo (regla dashboard §7): mensaje claro + acción posible. */
export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: string;
}) {
  return (
    <div className="empty">
      <span className="e-ic">
        <Icon name="chart" size={24} />
      </span>
      <b>{title}</b>
      <p>{message}</p>
      {action && (
        <button className="e-act" type="button">
          {action}
        </button>
      )}
    </div>
  );
}
