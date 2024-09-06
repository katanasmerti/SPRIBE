export function buildDateRange(): {min: string, max: string} {
  const todaysDate = new Date();

  const year = todaysDate.getFullYear();
  const day = formatNumber(`${todaysDate.getDate()}`);
  const month = formatNumber(`${todaysDate.getMonth() + 1}`);

  const max = `${year}-${month}-${day}`;

  return {min: '1940-01-01', max};
}

function formatNumber(numberString: string) {
  return numberString.toString().padStart(2, '0');
}
