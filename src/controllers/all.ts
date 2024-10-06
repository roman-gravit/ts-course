export { createTodo, getTodos, deleteTodo, updateTodo };

import { RequestHandler } from "express";
import { Todo } from "../models/todo";

const TODOS: Todo[] = [];

const createTodo: RequestHandler = (req, resp, _next) => {
	const id = Math.floor(Math.random()*1000).toString();
	const text = (req.body as {text: string}).text;
	const newTodo = new Todo(id, text);
	TODOS.push(newTodo);

	resp.status(201).json({ message: "Todo created", createdTodo: newTodo });
}

const getTodos: RequestHandler = (_req, resp, _next) => {
	resp.status(201).json({ todos: TODOS });
}

const deleteTodo: RequestHandler<{id: string}> = (req, resp, _next) => {
	const id = req.params.id;
	const index = TODOS.findIndex(item => item.id === id);
	if(index!=-1) {
		TODOS.splice(index, 1);
	}
	resp.status(201).json({ message: "Todo deleted"});
}

const updateTodo: RequestHandler<{id: string}> = (req, resp, _next) => {
	const id = req.params.id;
	const index = TODOS.findIndex(item => item.id === id);
	if(index==-1) {
		throw Error("Wrong todo id");
	}

	const text = (req.body as {text: string}).text;
	TODOS[index].text = text;
	resp.status(201).json({ message: "Todo updated", createdTodo: TODOS[index] });
}