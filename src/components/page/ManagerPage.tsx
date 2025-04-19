"use client";
import { useState } from "react";
import styles from "./ManagerPage.module.css";

type Task = {
  id: string;
  title: string;
  status: "pending" | "preparing" | "complete";
};

const initialTasks: Task[] = [
  { id: "1", title: "Review goals", status: "pending" },
  { id: "2", title: "Prepare report", status: "preparing" },
  { id: "3", title: "Send email", status: "complete" },
];

export default function ManagerPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const onDrop = (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: Task["status"]
  ) => {
    const taskId = e.dataTransfer.getData("text/plain");
  
    setTasks((prev) => {
      const taskToMove = prev.find((task) => task.id === taskId);
      if (!taskToMove) return prev;
      const filtered = prev.filter((task) => task.id !== taskId);
      return [...filtered, { ...taskToMove, status: newStatus }];
    });
  };
  
  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleCardClick = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
  
        const nextStatus: Task["status"] =
          task.status === "pending"
            ? "preparing"
            : task.status === "preparing"
            ? "complete"
            : "complete"; 
  
        return { ...task, status: nextStatus };
      })
    );
  };
  

  const renderColumn = (status: Task["status"]) => (
    <div
      className={styles.column}
      onDrop={(e) => onDrop(e, status)}
      onDragOver={allowDrop}
    >
      <h2 className={styles.heading}>{status.toUpperCase()}</h2>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <div
            key={task.id}
            className={styles.card}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            onClick={() => handleCardClick(task.id)}
          >
            {task.title}
          </div>
        ))}
    </div>
  );

  return (
    <div>
      <div className={styles.header}>
        Order List
      </div>
      <div className={styles.board}>
        {renderColumn("pending")}
        {renderColumn("preparing")}
        {renderColumn("complete")}
      </div>
    </div>
  );
}
