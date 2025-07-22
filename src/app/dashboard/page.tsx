"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeadlinePicker from "@/components/DeadlinePicker";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

type Priority = "Low" | "Medium" | "High";
type Todo = {
  id: number;
  title: string;
  done: boolean;
  priority: "Low" | "Medium" | "High";
  deadline?: string; //ISO string
  type: "todo" | "task";
};
// type Task = {
//   id: number;
//   title: string;
//   done: boolean;
//   priority: "Low" | "Medium" | "High";
//   deadline?: string; //ISO string
// };

const POINTS_MAP = {
  Low: 1,
  Medium: 2,
  High: 3,
};
export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  //const [tasks, setTasks] = useState<Task[]>([])
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<Priority>("Low");
  const [points, setPoints] = useState(0);
  const [threshold, setThreshold] = useState(10);
  const [deadline, setDeadline] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { data: session, status } = useSession();
  const [itemType, setItemType] = useState<"todo" | "task">("todo");

  //checking login
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session && session.user && session.user.email) {
      const email = session.user.email ?? "";
      setEmail(email);
      fetchUserAndTodos(email);
    }
    // const email = session?.user?.email
    // if(email){
    //   setEmail(email)
    //   fetchUserAndTodos(email)
    // }
  }, [session, status]);

  if (status === "loading") {
    return <div className="text-center mt-10">Loading dashboard...</div>;
  }
  const fetchUserAndTodos = async (email: string) => {
    try {
      const resUser = await fetch(`/api/user?email=${email}`);
      const userData = await resUser.json();
      const userId = userData?.user?.id;
      if (!userData) return;

      const resTodo = await fetch(`/api/todo?userID=${userId}`);
      const todoData = await resTodo.json();
      const loadedTodos: Todo[] = (todoData.todos || []).map((t: any) => ({
        ...t,
        title: t.title ?? "Untitled",
        type: "todo",
      }));
      const resTask = await fetch(`/api/task?userID=${userId}`);
      const taskData = await resTask.json();
      const loadedTasks: Todo[] = (taskData.tasks || []).map((t: any) => ({
        ...t,
        title: t.title ?? "Untitled",
        type: "task",
      }));
      setTodos([...loadedTasks, ...loadedTodos]);

      const totalTodoPoints = loadedTodos.reduce((sum, t) => {
        return t.done ? sum + getPoints(t.priority) : sum;
      }, 0);
      const totalTaskPoints = loadedTasks.reduce((sum, t) => {
        return t.done ? sum + getPoints(t.priority) : sum;
      }, 0);
      const totalPoints = totalTodoPoints + totalTaskPoints;
      setPoints(totalPoints);
      console.log("Todos from API:", todoData.todos);
      console.log("Tasks from API:", taskData.tasks);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === "") return;

    //const utcDeadline = deadline? new Date(deadline).toISOString : undefined

    const payload = {
      title: newTodo.trim(),
      done: false,
      priority,
      deadline: deadline || undefined,
      userEmail: email,
    };
    setIsSaving(true);
    try {
      const endpoint = itemType === "todo" ? "/api/todo" : "/api/task";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to save to DB", errText);
      } else {
        const result = await res.json();
        console.log("Saved to DB:", result);
      }
      setNewTodo("");
      setDeadline("");
      await fetchUserAndTodos(email);
    } catch (error) {
      console.error("API error", error);
    }
    setIsSaving(false);
  };

  const getPoints = (p: Priority) => POINTS_MAP[p];

  const toggleItem = async (item: Todo) => {
    const endpoint = item.type === "task" ? "task" : "todo";
    const newDone = !item.done;

    try {
      const res = await fetch(`/api/${endpoint}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newDone }),
        });
      console.log("Res here",endpoint,newDone)
      if (!res.ok) throw new Error("Update failed");

      setTodos((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, done: newDone } : t))
      );
      setPoints((p) =>
        newDone ? p + getPoints(item.priority) : p - getPoints(item.priority)
      );
    } catch (error) {
      console.error("Toggle error", error);
    }
  };

  const deleteTodo = (id: number) => {
    const todoToDelete = todos.find((t) => t.id === id);

    if (!todoToDelete) return;
    if (todoToDelete?.done) {
      setPoints((p) => p - getPoints(todoToDelete.priority));
    }
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newText } : t))
    );
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => signOut()}
        className="bg-white text-black rounded p-0.5"
      >
        Logout
      </button>
      <div className="flex py-2">
        <Link href="/">
          <h1 className="text-2xl font-bold mb-4 bg-white text-black rounded hover:text-blue-600">
            CheersDo{" "}
          </h1>
        </Link>
        <h1 className="text-2xl font-bold mb-4 px-2">Dashboard</h1>
      </div>
      <div>
        <div className="mb-6 text-gray-500 flex">
          You are :{" "}
          {session?.user?.email ? (
            <p className="font-bold text-white px-2">{session.user.email}</p>
          ) : (
            <p className="text-red-500 px-2">Not logged in</p>
          )}{" "}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new task"
          className="flex-1 border p-2 rounded"
        />
        <DeadlinePicker
          onChange={(dateString) => setDeadline(dateString)}
        ></DeadlinePicker>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          value={itemType}
          onChange={(e) => setItemType(e.target.value as "todo" | "task")}
        >
          <option value="todo">Todo</option>
          <option value="task">Task</option>
        </select>
        <button
          onClick={addTodo}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isSaving}
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={`${todo.type}-${todo.id}`}
            className="flex items-center justify-between bg-gray-100 p-2 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!todo.done}
                onChange={() => toggleItem(todo)}
              />
              <input
                type="text"
                autoFocus
                value={todo.title}
                onChange={(e) => editTodo(todo.id, e.target.value)}
                className={`bg-transparent border-none outline-none w-full text-black px-2
                  ${todo.done ? "line-through text-gray-500" : "text-black"}`}
              />
              {todo.deadline && (
                <span className="text-xs text-gray-500 ml-2">
                  🕒{new Date(todo.deadline).toLocaleString()}
                </span>
              )}
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  todo.priority === "High"
                    ? "bg-red-300 text-white"
                    : todo.priority === "Medium"
                    ? "bg-yellow-200 text-gray-600"
                    : "bg-green-200 text-black"
                }`}
              >
                {todo.priority}
              </span>
              {" - "}
              <span className="text-black">{todo.type}</span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold">
          🎯 Points: <span className="text-green-600">{points}</span>
        </p>
        <p>
          Set your reward threshold:
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="border p-1 w-16 ms-2 text-center rounded"
          />
        </p>
        {points >= threshold && (
          <div className="mt-3 bg-green-100 text-green-800 p-4 rounded shadow">
            🎉 You’ve earned {points} points! Time to reward yourself!
            <br />
            <span className="text-sm">You deserve it. 🍦🎬🚗</span>
          </div>
        )}
      </div>
    </div>
  );
}
