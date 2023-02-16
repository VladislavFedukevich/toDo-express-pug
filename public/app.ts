import { express, bodyParser, path, dotenv } from "./exports";
import { Todo } from "./interface";

const app = express();

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "/styles")));

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));

dotenv.config();

const todos: Todo[] = [];
app.get("/", (req: Request, res: Record<any, any>) => {
  res.render("index.pug", { title: "ToDo App", todos: todos });
});

app.get("/todos/:id/delete", (req: Request, res: Record<any, any>) => {
  const id = parseInt((req as any).params.id, 10);
  todos.splice(id, 1);
  res.redirect("/");
});

app.get("/todos", (req: Request, res: Record<any, any>) => {
  const showCompleted = (req as any).query.completed === "true";
  const filteredTodos = showCompleted
    ? todos.filter((todo) => todo.completed)
    : todos.filter((todo) => !todo.completed);
  res.render("index.pug", {
    title: "ToDo App",
    todos: filteredTodos,
  });
});

app.post("/todos", (req: Request, res: Record<any, any>) => {
  let todo: Todo = {
    title: (req as any).body.todo,
    completed: (req as any).body.completed === "on",
  };
  
  todos.push(todo);
  res.redirect("/");
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Express running => ${process.env.PORT}`);
});
