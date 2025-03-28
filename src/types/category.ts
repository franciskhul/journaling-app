export type Category = {
  id: string;
  name: string;
  systemGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCategory = {
  userId: string;
  categoryId: string;
};

export type CategoryWithUserFlag = {
  value: string;
  label: string;
};
