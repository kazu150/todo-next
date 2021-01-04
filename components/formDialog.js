import { useContext } from 'react';
import {TodoContext} from '../pages/';
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


export default function FormDialog() {
    const { 
        open, 
        setOpen, 
        status, 
        setStatus,
        state,
        dispatch
    } = useContext(TodoContext);

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
        dispatch({ type: 'clear_selectedTodo' })
        setStatus('未着手')
    };

    const getDate = () => {
        let date = new Date();
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    }

    const onTodoSubmit = (e) => {
        e.preventDefault();
        if (!state.selectedTodo.title) {
            alert('タイトルを入力してください')
            return
        }
        if (!state.selectedTodo.limit) {
            alert('期限を入力してください')
            return
        }

        if(state.selectedTodo.id){
            const newRows = state.rows.filter(row => row.id !== state.selectedTodo.id)
            const newSelectedTodo = {...state.selectedTodo}
            newSelectedTodo.status = status
            newSelectedTodo.updatedAt = getDate()
            dispatch({
                type: 'update_row',
                payload: [ ...newRows, newSelectedTodo ].sort((a,b) => {
                    if(a.id > b.id) return -1;
                    if(a.id < b.id) return 1;
                    return 0;
                })
            })
        } else {
            dispatch({
                type: 'create_row', 
                payload: {
                    title: state.selectedTodo.title, 
                    limit: state.selectedTodo.limit, 
                    createdAt: getDate(),
                    updatedAt: getDate(),
                    status: status,
                    description: state.selectedTodo.description,
                    id: state.rows.reduce((a,b) => a.id>b.id ? a : b).id + 1
                }
            })
        }        

        handleClose();
    }

    const onTodoDelete = () => {
        dispatch({
            type: 'delete_row',
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
            marginLeft: theme.spacing(1),
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
                            type: 'update_selectedTodo',
                            payload: { title: e.target.value }
                        })}
                        fullWidth
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
                            type: 'update_selectedTodo',
                            payload: { limit: e.target.value }
                        })}
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">状態</InputLabel>
                        <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id="status"
                            value={status}
                            onChange={handleChange}
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
                            type: 'update_selectedTodo',
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