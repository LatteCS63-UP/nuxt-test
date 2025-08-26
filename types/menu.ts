// type menuListInfo = {
//   title: string;
//   children?: string;
//   to?: string;
//   name?: string;
//   view?: boolean;
//   create?: boolean;
//   approve?: boolean;
//   showmenu?: boolean;
//   reconcile?: boolean;
//   icon?: any;
// };

export interface MenuRole {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  showmenu?: boolean;
  name?: string;
  view?: boolean;
  create?: boolean;
  approve?: boolean;
  reconcile?: boolean;
}
