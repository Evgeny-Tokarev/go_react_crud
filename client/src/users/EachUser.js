import {useState} from "react"
import {useNavigate} from "react-router-dom"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import {removeUser} from "api"

export default function EachUser({user, openEditPopup, oldFlag, triggerReloadList}) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const deleteUser = async () => {
        setOpen(false)
        const res = await removeUser(user.id)
        if (res.status === 200) triggerReloadList(!oldFlag)
    }
    return (
        <Card sx={{maxWidth: 345}} elevation={5}
              className="relative border border-transparent hover:border-[#1976d2;] ">
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {user.email}
                </Typography>
            </CardContent>
            <Collapse in={open} className="absolute inset-x-0 z-10">
                <Alert
                    severity="error"
                    action={
                        <div>
                            <Button size="small" color="error" variant="text" onClick={deleteUser}>Ok
                            </Button>
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit"/>
                            </IconButton>
                        </div>
                    }
                    sx={{mb: 2}}
                >
                    Shure?
                </Alert>
            </Collapse>
            <CardActions>
                <Button size="small" onClick={() => {
                    navigate(`/profile/${user.id}`)
                }}>View Profile</Button>
                <Button size="small" onClick={openEditPopup}>Edit</Button>
                <Button size="small" color="error" onClick={() => setOpen(true)}>Delete</Button>
            </CardActions>
        </Card>
    )
}