"use client"

export function getTodayYMD(): [number, number, number] {
  const today = new Date();
  
  const year = today.getFullYear();
  const month = today.getMonth(); // 1-based month
  const day = today.getDate();
  return [year, month, day];
}