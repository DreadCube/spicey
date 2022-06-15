const getMarkers = (id: string): number[] => {
  const markers = localStorage.getItem(`markers/${id}`);

  try {
    const parsedMarkers = markers ? JSON.parse(markers) : [];
    return parsedMarkers;
  } catch {
    return [];
  }
};

const addMarker = (marker: number, id: string): number[] => {
  const storedMarkers = getMarkers(id);

  const newMarkers = [
    ...storedMarkers,
    marker,
  ];

  localStorage.setItem(`markers/${id}`, JSON.stringify(newMarkers));
  return newMarkers;
};

const deleteMarkers = (id: string): void => localStorage.removeItem(`markers/${id}`);

export {
  getMarkers,
  addMarker,
  deleteMarkers,
};
