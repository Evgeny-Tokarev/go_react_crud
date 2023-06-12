import React, {useState, useEffect} from "react"
import {useParams, useNavigate} from "react-router-dom"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {Button, CardActionArea, CardActions} from '@mui/material';
import Divider from '@mui/material/Divider'
import {fetchUser} from 'api'

export default function ViewUser() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadUser = async() => {
            setLoading(true)
            const res = await fetchUser(id)
            if (res.status === 200) {
                setUser(res.data)
                setLoading(false)
            }
        }
        loadUser()
    }, [id])
    return (
        <div className="flex items-center h-screen background-slate-400">
            <Card
                sx={{
                    width: '90%', margin: '0 auto', maxWidth: '500px'
                }}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h3" component="h1" color="primary" sx={{textAlign: 'center'}}>
                            {user.name}
                        </Typography>
                        <Divider />
                        <Typography variant="h4" color="secondary">
                            {user.email}
                        </Typography>
                        <Divider />
                        <Typography variant="h4" color="secondary">
                            {new Date(user.date).toLocaleDateString('ru')}
                        </Typography>
                        <Divider />
                        <Typography variant="h4" color="secondary">
                            {user.city}
                        </Typography>
                        <Divider />
                        <Typography gutterBottom variant="h4" color="secondary">
                            {user.country}
                        </Typography>
                        <Divider />
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button variant="contained" size="small" color="primary" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </CardActions>
            </Card>
        </div>
    )
}
