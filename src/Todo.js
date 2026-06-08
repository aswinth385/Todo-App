import { useState,useEffect } from "react";

export default function Todo() {

    
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const [todos, setTodos] = useState([])
        const [error, setError] = useState("")
        const [message, setMessage] = useState("")
        const [editId, setEditId] = useState("")
        const apiUrl = "http://localhost:8000"

        // Edit
        const [editTitle, setEditTitle] = useState("");
        const [editDescription, setEditDescription] = useState("");

    const handleSubmit = ( ) => {
        setError("")
        // check inputs
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl+"/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title, description})
            }).then((res) => {
                if (res.ok) {
                    // add item to list
                    setTodos([...todos, {title, description}])
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully")
                    setTimeout(() => {
                        setMessage("");
                    },3000)
                }
                else{
                    // set error
                    setError("Unable to create Todo item")
                }
            }).catch(() => {
                setError("Unable to create Todo item")
            })

        }

    }

    useEffect(() => {
        getItems()
    },[])

    const getItems = () => {
        fetch(apiUrl + "/todos")
        .then((res) => res.json())
        .then((res) => {
            setTodos(res)
        })
    };

    const handleEdit = (item) => {
        setEditId(item._id); 
        setEditTitle(item.title);
        setEditDescription(item.description);
    }

    const handleUpdate = () => {

         setError("")
        // check inputs
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl+"/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: editTitle, description: editDescription})
            }).then((res) => {
                if (res.ok) {
                    // update item to list
                    const updateTodos = todos.map((item) => {
                        if (item._id == editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })
                    setTodos(updateTodos)
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated successfully")
                    setTimeout(() => {
                        setMessage("");
                    },3000)

                    setEditId(-1)

                }
                else{
                    // set error
                    setError("Unable to create Todo item")
                }
            }).catch(() => {
                setError("Unable to create Todo item")
            })

        }

    }

    const handleEditCancle = ()=>
    {
    setEditId(-1)
    } 

    const handleDelete = (id) => {
        if(window.confirm('Are you sure want to delete?'))
        {
            fetch(apiUrl+'/todos/' + id,{
                method: "DELETE"
            })
            .then (() => {
                const updateTodos = todos.filter((item) => item._id !== id)
                setTodos(updateTodos)
            })
        }
    }

    return(
<>
    <div className="row p-3 bg-success text-light">
    <h1>Todo compoents works!</h1>
    
    </div>
    <div className="row">
        <h2>ADD Item </h2>
        {message && <p className="text-success">{message}</p>}
    <div className="form-group d-flex gap-2">
       
        <input placeholder="Title"onChange={(event) => setTitle (event.target.value)} value ={title} className="form-control" type="text"/>
        <input placeholder="Description" onChange={(event) => setDescription (event.target.value)} value ={description} className="form-control" type="text"/>
       
        <button className="btn btn-dark" onClick={handleSubmit}> Submit </button>

    </div>
        {error && <p className="text-danger">{error}</p>}
    </div>

    <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
            <ul className="list-group">
            {
                todos.map((item)=>  <li key={item._id} className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                <div className="d-flex flex-column me-2">
                   {
                     editId !== item._id ? <>
                        <span className="fw-bold">{item.title}</span>
                        <span>{item.description}</span>
                   </> : <>
                   <div className="form-group d-flex gap-2">
                            <input placeholder="Title"onChange={(event) => setEditTitle (event.target.value)} value ={editTitle} className="form-control" type="text"/>
                            <input placeholder="Description" onChange={(event) => setEditDescription (event.target.value)} value ={editDescription} className="form-control" type="text"/>
                    </div>         
                   </>
                   }
                    </div>
                <div className="d-flex gap-2">
                    { editId !== item._id ?<button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>:<button className= "btn btn-warning" onClick={handleUpdate}>Update</button>}
                    { editId !== item._id ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>:
                    <button className="btn btn-danger" onClick={handleEditCancle}>Cancel</button> }
                </div>
            </li>
                )
            }
        </ul>
        </div>
        
    </div>
   
</>
    );
} 