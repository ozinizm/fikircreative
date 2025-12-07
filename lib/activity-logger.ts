import prisma from "./prisma";

export type ActivityAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "VIEW"
  | "EXPORT";

export type ActivityEntity =
  | "CLIENT"
  | "TASK"
  | "TRANSACTION"
  | "USER"
  | "EVENT"
  | "REPORT"
  | "EQUIPMENT"
  | "PROJECT";

interface ActivityLogData {
  userId: string;
  action: ActivityAction;
  entity: ActivityEntity;
  entityId?: string;
  details?: string;
  metadata?: Record<string, any>;
}

export async function logActivity(data: ActivityLogData) {
  const { userId, action, entity, entityId, details, metadata } = data;
  
  try {
    // Validate required fields
    if (!userId || !action || !entity) {
      console.error('[ACTIVITY] Missing required fields:', { userId, action, entity });
      return;
    }

    // Store in database (future: add ActivityLog model to schema)
    console.log(`[ACTIVITY] ${action} ${entity}`, {
      userId,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    });

    // Future: Send to notification system for important actions
    if (["DELETE", "UPDATE"].includes(action)) {
      // Could trigger notification here
    }

    return true;
  } catch (error) {
    console.error("Error logging activity:", error);
    return false;
  }
}

// Helper function to create activity descriptions
export function createActivityDescription(
  action: ActivityAction,
  entity: ActivityEntity,
  itemName?: string
): string {
  const entityNames: Record<ActivityEntity, string> = {
    CLIENT: "Müşteri",
    TASK: "Görev",
    TRANSACTION: "İşlem",
    USER: "Kullanıcı",
    EVENT: "Etkinlik",
    REPORT: "Rapor",
    EQUIPMENT: "Ekipman",
    PROJECT: "Proje",
  };

  const actionVerbs: Record<ActivityAction, string> = {
    CREATE: "oluşturdu",
    UPDATE: "güncelledi",
    DELETE: "sildi",
    LOGIN: "giriş yaptı",
    LOGOUT: "çıkış yaptı",
    VIEW: "görüntüledi",
    EXPORT: "dışa aktardı",
  };

  const entityLabel = entityNames[entity];
  const actionVerb = actionVerbs[action];

  if (entityLabel && itemName) {
    return `${entityLabel} "${itemName}" ${actionVerb}`;
  }

  return `${entityLabel} ${actionVerb}`;
}

// Create notification from activity
export async function createActivityNotification(
  userId: string,
  activity: ActivityLogData
) {
  try {
    const description = createActivityDescription(
      activity.action,
      activity.entity,
      activity.details
    );

    await prisma.notification.create({
      data: {
        title: "Yeni Aktivite",
        message: description,
        type: "INFO",
        userId,
      },
    });
  } catch (error) {
    console.error("Error creating activity notification:", error);
  }
}
