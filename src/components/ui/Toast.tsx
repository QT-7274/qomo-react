import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import Button from './Button';

const Toast: React.FC = () => {
  const { ui, dismissNotification } = useAppStore();

  const getIcon = (type: Notification['type']) => {
    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
    };
    return icons[type];
  };

  const getColors = (type: Notification['type']) => {
    const colors = {
      success: {
        bg: 'bg-green-50 border-green-200',
        icon: 'text-green-600',
        title: 'text-green-800',
        message: 'text-green-700',
      },
      error: {
        bg: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        title: 'text-red-800',
        message: 'text-red-700',
      },
      warning: {
        bg: 'bg-yellow-50 border-yellow-200',
        icon: 'text-yellow-600',
        title: 'text-yellow-800',
        message: 'text-yellow-700',
      },
      info: {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        message: 'text-blue-700',
      },
    };
    return colors[type];
  };

  React.useEffect(() => {
    ui.notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          dismissNotification(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [ui.notifications, dismissNotification]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {ui.notifications.map((notification) => {
          const Icon = getIcon(notification.type);
          const colors = getColors(notification.type);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                'p-4 rounded-lg border shadow-lg backdrop-blur-sm',
                colors.bg
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', colors.icon)} />
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn('text-sm font-medium', colors.title)}>
                    {notification.title}
                  </h4>
                  {notification.message && (
                    <p className={cn('text-sm mt-1', colors.message)}>
                      {notification.message}
                    </p>
                  )}
                  
                  {notification.actions && notification.actions.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {notification.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.style === 'primary' ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => {
                            action.action();
                            dismissNotification(notification.id);
                          }}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissNotification(notification.id)}
                  className="p-1 hover:bg-black/5 rounded-full flex-shrink-0"
                  icon={<X className="w-4 h-4" />}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
