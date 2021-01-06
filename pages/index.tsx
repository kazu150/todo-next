import React, { useState, useReducer, useEffect } from 'react'
import TodoList from '../components/todoList'
import FormDialog from '../components/formDialog'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { sort } from '../utils/sort';

type contextType = {
  rows?: {key?: string}[]
  selectedTodo?: any
  sortBy:any
  setSortBy:any
  open:any 
  setOpen:any
  state:any
  dispatch:any
  checked:any
  setChecked: any
}

const initialState = {
  rows: [],
  selectedTodo: {
    title: '',
    limit: '',
    createdAt: '',
    updatedAt: '',
    status: '',
    description: '',
    id: '',
    errorPart: ''
  },
  sortBy:null,
  setSortBy:null,
  open:null, 
  setOpen:null,
  state:null,
  dispatch:null,
  checked:null,
  setChecked: null,
}

export const TodoContext = React.createContext<contextType>(initialState)

export default function Home() {  
  const [sortBy, setSortBy] = useState(['createdAt', true]);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState([])



  useEffect(() => {
    dispatch({
      type: 'row_initiate',
      payload: JSON.parse(localStorage.getItem('rows'))
    })
  }, [])


  const reducer = (state, action) => {
    switch(action.type) { 
      case 'row_initiate':
        return {
          ...state,
          rows: action.payload
        }
      case 'row_create':
        return {
          ...state,
          rows: sort([ ...state.rows, action.payload], sortBy),
        }
      case 'row_update':
        return {
          ...state,
          rows: action.payload,
        }
      case 'row_delete':
        return {
          ...state,
          rows: action.payload,
      }
      case 'row_deleteSelected':
        return {
          ...state,
          rows: action.payload,
          selectedTodo: initialState.selectedTodo
      }
      case 'selectedTodo_set':
        return {
          ...state,
          selectedTodo: action.payload,
        }
      case 'selectedTodo_update':
        return {
          ...state,
          selectedTodo: { ...state.selectedTodo, ...action.payload,  errorPart: '' }
        }
      case 'selectedTodo_clear':
        return {
          ...state,
          selectedTodo: initialState.selectedTodo
        }
      case 'selectedTodo_error':
        return {
          ...state,
          selectedTodo: { ...state.selectedTodo, errorPart: action.payload }
        }
      default: 
        break;
    }
  }

  const [ state, dispatch ] = useReducer(reducer, initialState)

  useEffect(() => {
    localStorage.setItem('rows', JSON.stringify(state.rows))
  }, [state.rows]); 

  const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: '20px',
        marginLeft: '20px'
    }
  }));  
  const classes = useStyles();

  return (
    <TodoContext.Provider 
      value={{
        sortBy,
        setSortBy,
        open, 
        setOpen,
        state,
        dispatch,
        checked,
        setChecked,
      }} 
    >
      <div className="App">
        <TodoList />
        <FormDialog />
        <Button 
          className={classes.button} 
          variant="outlined" 
          color="primary" 
          onClick={() => setOpen(true)}
        >
          TODOを登録する
        </Button>
        { 
          checked.length ?
          <Button 
            className={classes.button} 
            variant="outlined" 
            color="secondary" 
            onClick={() => {
              dispatch({
                type: 'row_deleteSelected',
                payload: [ ...state.rows ].filter(row => { 
                  return !checked.some(item => item === row.id.toString())
                })
              })
              setChecked([])
            }}
          >
            TODOをまとめて削除する
          </Button>  : ''
        }
      </div>
    </TodoContext.Provider>
  );
}
