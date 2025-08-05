import { DateTime } from "luxon";

export type FilterType = "today" | "week" | "month" | "year"

export function getFilterTodo(todos: Todo[], filter: FilterType): Todo[]{
    const now =DateTime.local()

    return todos.filter((todo) =>{
        if(!todo.deadline) return false

        const deadline = DateTime.fromISO(todo.deadline, {zone: "utc"}).toLocal()

        switch (filter) {
            case "today":
                return deadline.hasSame(now, "day")
            case "week":
                return deadline.hasSame(now, "week")
            case "month":
                return deadline.hasSame(now, "month")
            case "year":
                return deadline.hasSame(now, "year")
        
            default:
                return true;
        }
    })
}