export type TUseSet = <T>(initValues: T) => [T, React.Dispatch<Partial<T>>];

export interface IModalContentProps {
    mode: "new" | "edit" | "view";
}
export interface IEditState {
    modalVisible: boolean;
    initData: Record<string, any> | null;
    mode: IModalContentProps["mode"];
}
