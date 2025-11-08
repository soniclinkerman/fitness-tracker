export interface CardActionProps<T> {
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onClick?: (item: T) => void;
}