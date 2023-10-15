/*
  input: minus
  
  - calculate in contract is seconds 
  => So please formatDeadlineTime before pass into redux or calculator

*/
export const getNow = () => Date.now();

export const formatDisplayDeadlineTime = (seconds: string | number) => parseInt(seconds.toString(), 10) / 60;
export const formatDeadlineTime = (seconds: string | number) => parseInt(seconds.toString(), 10) * 60;

export const formatDisplayTime = (date: Date) => {
  if (!(date.getTime() > 0)) return '0000-00-00 00:00:00';

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  // const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
};
