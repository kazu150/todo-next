import React, {
    FC,
    useState,
    useReducer,
    useEffect,
    createContext,
    Dispatch,
    SetStateAction,
} from 'react';
import TodoList from '../components/todoList';
import FormDialog from '../components/formDialog';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { sort } from '../utils/sort';

export type row = {
    title?: string;
    limit?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: number;
    description?: string;
    id?: number;
    errorPart?: string;
};

export type contextType = {
    rows?: row[];
    selectedTodo?: row;
    sortBy?: [string, boolean];
    setSortBy?: Dispatch<SetStateAction<[string, boolean]>>;
    open?: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    state?: any;
    dispatch?: Dispatch<any>;
    checked?: string[];
    setChecked?: Dispatch<SetStateAction<string[]>>;
};

type reducerState = {
    rows: row[];
    selectedTodo: row;
};

const initialState: reducerState = {
    rows: [],
    selectedTodo: {
        title: '',
        limit: '',
        createdAt: '',
        updatedAt: '',
        status: 0,
        description: '',
        id: null,
        errorPart: '',
    },
};

export const TodoContext = createContext<contextType>(initialState);

const Home: FC = () => {
    const [sortBy, setSortBy] = useState<[string, boolean]>([
        'createdAt',
        true,
    ]);
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState<string[]>([]);

    useEffect(() => {
        dispatch({
            type: 'row_initiate',
            payload:
                JSON.parse(localStorage.getItem('rows')) || initialState.rows,
        });
    }, []);

    const reducer = (
        state: reducerState,
        action: { type: string; payload: any }
    ): reducerState => {
        switch (action.type) {
            case 'row_initiate':
                return {
                    ...state,
                    rows: action.payload,
                };
            case 'row_create':
                return {
                    ...state,
                    rows: sort([...state.rows, action.payload], sortBy),
                };
            case 'row_update':
                return {
                    ...state,
                    rows: action.payload,
                };
            case 'row_delete':
                return {
                    ...state,
                    rows: action.payload,
                };
            case 'row_deleteSelected':
                return {
                    ...state,
                    rows: action.payload,
                    selectedTodo: initialState.selectedTodo,
                };
            case 'selectedTodo_set':
                return {
                    ...state,
                    selectedTodo: action.payload,
                };
            case 'selectedTodo_update':
                return {
                    ...state,
                    selectedTodo: {
                        ...state.selectedTodo,
                        ...action.payload,
                        errorPart: '',
                    },
                };
            case 'selectedTodo_clear':
                return {
                    ...state,
                    selectedTodo: initialState.selectedTodo,
                };
            case 'selectedTodo_error':
                return {
                    ...state,
                    selectedTodo: {
                        ...state.selectedTodo,
                        errorPart: action.payload,
                    },
                };
            default:
                break;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        localStorage.setItem('rows', JSON.stringify(state.rows));
    }, [state.rows]);

    const useStyles = makeStyles((theme) => ({
        button: {
            marginTop: '20px',
            marginLeft: '20px',
        },
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
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6">Todos</Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar />

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
                {checked.length ? (
                    <Button
                        className={classes.button}
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            dispatch({
                                type: 'row_deleteSelected',
                                payload: [...state.rows].filter((row) => {
                                    return !checked.some(
                                        (item) => item === row.id.toString()
                                    );
                                }),
                            });
                            setChecked([]);
                        }}
                    >
                        TODOをまとめて削除する
                    </Button>
                ) : (
                    ''
                )}
            </div>
        </TodoContext.Provider>
    );
};

export default Home;
