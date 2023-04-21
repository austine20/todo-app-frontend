import "./app.css";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./Loader/Loader";

function App() {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [todoId, setTodoId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  const baseURL = `https://nodejs-todo-app-apis.onrender.com`;

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    await axios
      .get(baseURL)
      .then(({ data }) => {
        console.log(data);
        setTodo(data);
      })
      .catch((err) => console.log(err));
  };

  const addTodo = async () => {
    if (text === "") {
      setError("Please, Add a Todo!!!");
    } else {
      setStatus("loading");
      await axios.post(`${baseURL}/create`, { text }).then((data) => {
        console.log(data);
        setError("");
        setText("");
        getTodos();
        setStatus("fail");
      });
    }
  };

  const updateTodo = async () => {
    const payload = {
      id: todoId,
      text,
    };
    await axios
      .put(`${baseURL}/update`, payload)
      .then((data) => {
        console.log(data);
        setText("");
        setIsUpdating(false);
        getTodos();
      })
      .catch((err) => console.log(err));
  };

  const deleteTodo = async (id: string) => {
    const payload = {
      id: id,
    };
    await axios
      .delete(`${baseURL}/delete`, { data: payload })
      .then((data) => {
        console.log(data);
        getTodos();
      })
      .catch((err) => console.log(err));
  };

  const updateList = (_id: string, text: string) => {
    setIsUpdating(true);
    setText(text);
    setTodoId(_id);
  };

  console.log(todo);

  return (
    <main className="main">
      <section className="wrapper">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="todo..."
            className="input-field"
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <button
            type="submit"
            className="btn"
            onClick={isUpdating ? updateTodo : addTodo}
          >
            {isUpdating ? "Update" : "Add"}
          </button>
        </div>
        <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
          {error}
        </p>

        {status === "loading" ? (
          <Loader />
        ) : (
          <>
            {todo.map((item) => (
              <div key={item._id} className="todo-item">
                <p>{item.text}</p>
                <div className="todo-cta">
                  <AiFillEdit
                    className="icon"
                    onClick={() => updateList(item._id, item.text)}
                  />
                  <AiFillDelete
                    className="icon"
                    onClick={() => deleteTodo(item._id)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </section>
    </main>
  );
}

type Todo = {
  _id: string;
  text: string;
};

export default App;
