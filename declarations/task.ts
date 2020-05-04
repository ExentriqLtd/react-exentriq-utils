export interface TTask {
  title: string;
  titleEml?: string;
  meta: {
    effort?: string;
    points?: string;
    progress?: string;
    budget?: string;
    roomId: string;
    createdMeta: {
      id: string;
    };
    eta?: string;
  };
  parents: string[];
  userId: string;
}
