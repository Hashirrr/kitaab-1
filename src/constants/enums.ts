export enum Cursor {
  grab = 'grab',
  pointer = 'pointer'
}

export enum IconButtonBackground {
  primary = 'primary',
  secondary = 'secondary'
}

export enum Mode {
  dark = 'dark',
  light = 'light'
}

export enum ModalCTA {
  no = 'No',
  add = 'Add',
  yes = 'Yes',
  back = 'Back',
  cancel = 'Cancel',
  delete = 'Delete',
  update = 'Update',
  confirm = 'Confirm',
  adding = 'Adding...',
  deleting = 'Deleting...',
  updating = 'Updating...'
}

export enum DeedCategory {
  hasanaat = 'Hasanaat',
  sayyiaat = 'Sayyi\'aat'
}

export enum Keys {
  escape = 'Escape'
}

export enum EventListeners {
  resize = 'resize',
  keydown = 'keydown'
}

export enum Overflow {
  auto = 'auto',
  empty = 'empty',
  hidden = 'hidden'
}

export enum ModalTypes {
  add_deed = 'add_deed',
  add_scale = 'add_scale',
  edit_deed = 'edit_deed',
  edit_scale = 'edit_scale',
  delete_deed = 'delete_deed',
  delete_scale = 'delete_scale'
}

export enum ButtonType {
  button = 'button',
  submit = 'submit'
}

export enum Routes {
  deeds = '/deeds',
  new_deeds = '/deeds/new',
  view_deeds = '/deeds/view'
}

export enum LocalStorage {
  mode = 'mode',
  access_token = 'access_token',
  deed_category = 'deed_category'
}

export enum SessionStorage {
  mode = 'mode',
  deed_category = 'deed_category'
}

export enum DeedHideTypes {
  none = 'none',
  hide_from_graphs = 'hide_from_graphs'
}

export enum DeedTypes {
  scale = 'Scale',
  count = 'Count'
}

export enum DraggableCardVariants {
  parent = 'parent',
  children = 'children'
}

export enum Form {
  deed_add = 'deed_add',
  scale_edit = 'scale_edit'
}

export const DeedCategoryApi = {
  [DeedCategory.hasanaat]: 'hasanaat',
  [DeedCategory.sayyiaat]: 'saiyyiaat'
} as const;