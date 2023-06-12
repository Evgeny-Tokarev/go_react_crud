import React, {useEffect, useState, useRef, useContext} from "react"
import Button from '@mui/material/Button'
import EachUser from "users/EachUser"
import {useSearchParams, useNavigate} from "react-router-dom"
import UserForm from "users/UserForm";
import {fetchData} from "api"
import { PopupCallback } from 'App'

export default function List() {
    const [users, setUsers] = useState([])
    const [pages, setPages] = useState(0)
    const [editedUser, setEditedUser] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [dataHasChangedFlag, setDataHasChangedFlag] = useState(false)
    const callback = useContext(PopupCallback);
    let navigate = useNavigate()

    useEffect(() => {
        const loadData = async () => {
            const page = searchParams.get("page") ? `&page=${searchParams.get("page")}` : ''
            const resp = await fetchData(page)
            if (resp.status === 200) {
                const currentPage = +searchParams.get("page")
                if (currentPage >= resp.data.total_pages && currentPage > 0) {
                    setSearchParams(searchParams => {
                        searchParams.set("page", `${currentPage - 1}`);
                        return searchParams;
                    })
                }
                setUsers(resp.data.items)
                setPages(resp.data.total_pages)
            }
        }
        loadData()
    }, [searchParams, dataHasChangedFlag])
    const myForm = useRef(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const openEditPopup = (user) => {
        setEditedUser(user)
        setIsModalOpen(true)
    }
    const createNewUser = () => {
        setEditedUser(null)
        setIsModalOpen(true)
    }
    let myPage = searchParams.get("page") ? searchParams.get("page") : 0
    return (
        <div className="flex justify-center overflow-hidden">
            <div className="lg:w-1/3 w-full h-[100vh]">
                <div className="p-10 flex flex-col h-full items-center">
                    <div className="mb-10 flex items-center justify-between text-center gap-12">
                        <h1 className="font-bold mx-auto text-2xl">CRUD App</h1>
                        <Button variant="contained" disableElevation onClick={createNewUser}>Add
                            user</Button>
                    </div>
                    <div className="flex flex-col gap-4 items-center">
                        {users.map((user, idx) => <EachUser key={idx} user={user} oldFlag={dataHasChangedFlag} triggerReloadList={setDataHasChangedFlag} openEditPopup={() => openEditPopup(user)}/>)}
                    </div>
                    <div className="mt-auto gap-2 flex">
                        {Array.from({length: pages}, (_, index) => index + 1).map((page, key) =>
                            <Button variant={`${+myPage === key ? 'contained' : 'outlined'}`} disableElevation
                                    key={key} onClick={() => navigate(`/?page=${key}`)}>{key + 1}</Button>
                        )}
                    </div>
                    <UserForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} myForm={myForm}
                              fetchData={fetchData} user={editedUser}/>
                </div>
            </div>
        </div>
    )
}