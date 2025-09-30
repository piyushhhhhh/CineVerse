import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pickRandomIndex(arrLength: number) {
  return Math.floor(Math.random() * arrLength)
}
  