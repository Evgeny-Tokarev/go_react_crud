import React, {useRef, useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import Card from '@mui/material/Card';
import {updateUser, createNewUser} from "api";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import {PopupCallback} from 'App'

export default function UserForm({isModalOpen, setIsModalOpen, myForm, fetchData, user}) {
    const modal = useRef(null)
    const navigate = useNavigate()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const popup = useContext(PopupCallback);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setDate(new Date(user.date).toISOString().split("T")[0] || '');
            setCity(user.city || '');
            setCountry(user.country || '');
        }
    }, [user]);
    const storeUser = async (e) => {
        e.preventDefault()
        const formData = new FormData(myForm.current);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('date', date);
        formData.append('city', city);
        formData.append('country', country);

        if (!user) {
            const res = await createNewUser(formData)
            console.log(res)
            if (res.status === 200) {
                clearForm()
                setIsModalOpen(() => false)
                await fetchData()
                navigate("/")
                popup("Successfully created", "success")
            } else {
                popup(res.message, "error")
            }
        } else {
            const res = await updateUser(formData, user.id)
            console.log(res)
            if (res.status === 200) {
                clearForm()
                setIsModalOpen(() => false)
                await fetchData()
                navigate("/")
                popup("Successfully updated", "success")
            } else {
                popup(res.message, "error")
            }
        }
    }
    const clearForm = () => {
        setName('');
        setEmail('');
        setDate('');
        setCity('');
        setCountry('');
    }
    return (
        <div
            className={`fixed ${isModalOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'} inset-0 z-10 transition-all duration-200`}
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            ref={modal}
            id="newModal"
        >
            <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity flex items-center">
                <Card sx={{
                    width: '50%',
                    minWidth: 390,
                    minHeight: 600,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'stretch'
                }}>
                    <form className="grow flex" ref={myForm} onSubmitCapture={storeUser} id="newform">
                        <div className="bg-white grow flex flex-col">
                            <div className="flex justify-between px-8 py-4 border-b">
                                <h1 className="font-medium ">Create new user</h1>
                                <IconButton aria-label="delete" size="small"
                                            onClick={() => setIsModalOpen(() => false)}>
                                    <Close fontSize="small"/>
                                </IconButton>
                            </div>
                            <div className="p-4 grow flex flex-col justify-between items-stretch gap-2 sm:gap-4">
                                <label className="block text-gray-700 text-sm font-bold">Name
                                    <input type="text" name="name" value={name}
                                           onChange={(e) => setName(e.target.value)}
                                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow"
                                           required={true}/>
                                </label>
                                <label className="block text-gray-700 text-sm font-bold">
                                    Email
                                    <input type="email" name="email" value={email}
                                           onChange={(e) => setEmail(e.target.value)}
                                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow"
                                           required={true}/>
                                </label>
                                <label className="block text-gray-700 text-sm font-bold">
                                    Date
                                    <input type="date" name="date" value={date}
                                           onChange={(e) => setDate(e.target.value)}
                                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow"
                                           required={true}/>
                                </label>
                                <label className="block text-gray-700 text-sm font-bold">
                                    City
                                    <input type="text" name="city" value={city}
                                           onChange={(e) => setCity(e.target.value)}
                                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow"
                                           required={true}/>
                                </label>
                                <label className="block text-gray-700 text-sm font-bold">
                                    Country
                                    <input type="text" name="country" value={country}
                                           onChange={(e) => setCountry(e.target.value)}
                                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow"
                                           required={true}/>
                                </label>
                                <ButtonGroup aria-label="outlined primary button group"
                                             sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Button type="submit" variant="contained">save</Button>
                                    <Button onClick={clearForm} color="warning">clear</Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

