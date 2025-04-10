import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { isBefore, isAfter } from "date-fns"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function eventStatus(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isBefore(now, start)) {
      return 'Sắp diễn ra';
  }
  else if (isAfter(now, end)) {
      return 'Đã diễn ra';
  }
  return 'Đang diễn ra';
}

export function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}