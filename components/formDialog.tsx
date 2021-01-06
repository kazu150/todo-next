import { useContext } from 'react';
import {TodoContext} from '../pages';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { sort } from '../utils/sort';
import { getDate } from '../utils/getDate';


export default function FormDialog() {

    const { 
        open, 
        setOpen, 
        state,
        dispatch,
        sortBy
    } = useContext(TodoContext);

    const handleClose = () => {
        setOpen(false);
        dispatch({ type: 'selectedTodo_clear' })
    };

    const onTodoSubmit = (e) => {
        e.preventDefault();
        if (!state.selectedTodo.title) {
            dispatch({ type: 'selectedTodo_error', payload: 'title' })
            return
        }
        if (!state.selectedTodo.limit) {
            dispatch({ type: 'selectedTodo_error', payload: 'limit' })
            return
        }
        if(state.selectedTodo.id){
            const newRows = state.rows.filter(row => row.id !== state.selectedTodo.id)
            const newSelectedTodo = {...state.selectedTodo}
            newSelectedTodo.updatedAt = getDate()
            dispatch({
                type: 'row_update',
                payload: sort([ ...newRows, newSelectedTodo ], sortBy)
            })
        } else {
            dispatch({
                type: 'row_create', 
                payload: {
                    title: state.selectedTodo.title, 
                    limit: state.selectedTodo.limit, 
                    createdAt: getDate(),
                    updatedAt: getDate(),
                    status: state.selectedTodo.status === '' ? '未着手' : state.selectedTodo.status,
                    description: state.selectedTodo.description,
                    id: !state.rows.length ? 0 : state.rows.reduce((a,b) => a.id>b.id ? a : b).id + 1
                }
            })
        }        

        handleClose();
    }

    const onTodoDelete = () => {
        dispatch({
            type: 'row_delete',
            payload: state.rows.filter(row => row !== state.selectedTodo)
        })
        handleClose()
    }

    const useStyles = makeStyles((theme) => ({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginRight: theme.spacing(1),
            width: 200,
            marginLeft: 0,
            marginTop: '10px',
            marginBottom: '10px',
            display: 'block'
        },
        formControl: {
            display: 'block',
            width: '100%',
            marginBottom: '10px',
        },
        block: {
            display: 'block',
        }
    }));

    const classes = useStyles();

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">TODO</DialogTitle>
                <DialogContent className={classes.container}>
                    <DialogContentText>
                        TODOを編集します
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="タイトル"
                        type="text"
                        value={state.selectedTodo.title}
                        onChange={e => dispatch({
                            type: 'selectedTodo_update',
                            payload: { title: e.target.value }
                        })}
                        fullWidth
                        error={state.selectedTodo.errorPart === "title" ? true : false }
                        helperText={state.selectedTodo.errorPart === "title" ? "タイトルを入力してください" : "" }
                    />
                    <TextField
                        id="limit"
                        label="期限"
                        type="date"
                        fullWidth
                        value={state.selectedTodo.limit}
                        className={classes.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        onChange={e => dispatch({
                            type: 'selectedTodo_update',
                            payload: { limit: e.target.value }
                        })}
                        error={state.selectedTodo.errorPart === "limit" ? true : false }
                        helperText={state.selectedTodo.errorPart === "limit" ? "期限を入力してください" : "" }
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">状態</InputLabel>
                        <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id="status"
                            value={state.selectedTodo.status}
                            onChange={e => dispatch({
                                type: 'selectedTodo_update',
                                payload: { status: e.target.value }
                            })}
                        >
                            <MenuItem value={"未着手"}>未着手</MenuItem>
                            <MenuItem value={"途中"}>途中</MenuItem>
                            <MenuItem value={"完了"}>完了</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="詳細"
                        type="text"
                        multiline
                        rows={4}
                        value={state.selectedTodo.description}
                        onChange={e => dispatch({
                            type: 'selectedTodo_update',
                            payload: { description: e.target.value }
                        })}
                        fullWidth
                    />
                    <DialogContentText className={classes.block}>
                        作成日：{state.selectedTodo.createdAt}<br/>
                        最終更新日：{state.selectedTodo.updatedAt}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onTodoDelete} color="secondary">
                        削除
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        キャンセル
                    </Button>
                    <Button onClick={onTodoSubmit} color="primary">
                        追加
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}