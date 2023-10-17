export interface Itemprops {
  link: string;
  title: string;
  date: string;
  number: string;
  index: number;
  content: string;
  memos: Itemprops[];
  modalIsOpen: boolean;
  modalEditMode: boolean;
  closeModal: () => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  addMemo: () => void;
  deletMemo: () => void;
  openModal: () => void;
  openEditModal: (index: number) => void;
}
