import { format, formatDistanceToNowStrict } from 'date-fns';

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'dd MMMM, yyyy \'at\' hh:mm a');
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return formatDistanceToNowStrict(date, { addSuffix: true });
};
