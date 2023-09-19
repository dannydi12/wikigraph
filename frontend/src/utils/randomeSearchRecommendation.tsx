
export const randomSearchRecommendation = (arrayOfOptions: string[]) => {
  const randomIndex = Math.floor(Math.random() * arrayOfOptions.length);
  return arrayOfOptions[randomIndex];
};