'use client'
import styles from './styles.module.css';

import { Package } from "@/app/entity/package";
import { Users2, X } from "lucide-react";
import { ChangeEvent, Dispatch, FC, FormEvent, FormEventHandler, SetStateAction, useEffect, useState } from "react";
import { ApiResponse } from '@/app/types/api';
import { usePackageStore } from '@/app/store/packageStore';
import { handlePriceFormat } from '@/app/lib/formatting';

const NewPackageForm:FC<{setShowNewPackageForm:Dispatch<SetStateAction<boolean>>}> = ({setShowNewPackageForm}) => {
    const { addPackage, _package, setPackage:_setNewPackage, packages, setPackages } = usePackageStore();
    const [newPackage, setNewPackage] = useState<Package>({
        name: _package.name??'',
        price: _package.price??0,
        benefits: _package.benefits??[],
        duration_days: _package.duration_days??0,
        group_size: _package.group_size??1,
        is_active: true,
    });
    const [isGroupPackage, setIsGroupPackage] = useState<boolean>(_package.id?true:false);
    const emptyFields = {
            name: '',
            price: '',
            duration_days: '',
            group_size: '',
    }
    const [timeInput, setTimeInput] = useState<{dia:boolean, semana:boolean, mes:boolean}>({
        dia:true,
        semana:false,
        mes:false
    })
    const [inputErrors, setInputErrors] = useState(emptyFields)
    const [price, setPrice]= useState<string>(_package.id?`${_package.price}`:'');
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (newPackage.name === '') {
                setInputErrors({ ...emptyFields, name: 'El campo nombre es obligatorio' })
                return;
            }
            if (newPackage.price === 0) {
                setInputErrors({ ...emptyFields, price:'Añade un precio'})
            }
            if (newPackage.duration_days === 0){
                setInputErrors({...emptyFields, duration_days:'Debes añadir un minimo de días'})
                return;
            }
            if (newPackage.group_size === 0){
                setInputErrors({...emptyFields, group_size:'Debes admitir por lo menos 1 persona'})
                return;
            }
            if(timeInput.semana){
                newPackage.duration_days = newPackage.duration_days * 7
            }
            if(timeInput.mes){
                newPackage.duration_days = newPackage.duration_days * 30
            }
            newPackage.created_at = new Date();
            newPackage.updated_at = new Date();
            newPackage.is_active = true;
            let fetchConf = {
                url:'',
                method:'',
                body:{}
            }
            if(_package.id){
                fetchConf = {
                    url:`/api/package/${_package.id}`,
                    method:'PUT',
                    body:_package
                }
            }else{
                fetchConf = {
                url:'/api/package',
                method:"POST",
                body:newPackage
            }
            }

            const res = await fetch(fetchConf.url, {
                method: fetchConf.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPackage)
            })
            const response:ApiResponse = await res.json();
            if(response.success){
                if(response.code === 'PACKAGE_CREATED'){
                    addPackage(response.data)
                }else if(response.code === "PACKAGE_UPDATED"){
                    const _packages:Package[] = [...packages];
                    const pkgIndex:number = _packages.findIndex(el=>el.id===_package.id);
                    if(pkgIndex===-1){
                        throw new Error('not pkg found to update')
                    }
                    _packages[pkgIndex] = newPackage;
                    setPackages([..._packages])
                    
                }
            }
        } catch (error) {
            console.log(error);
        }finally{
            setShowNewPackageForm(false);
        }
    }
    const handleGroupToggle = ()=>{
        setIsGroupPackage(!isGroupPackage);
        setNewPackage({...newPackage, group_size:1})
    }
    const handleOnChange = (event:ChangeEvent<HTMLInputElement>)=>{
        setInputErrors({ ...emptyFields})
        if(event.currentTarget.name === 'duration_days'){
            setNewPackage({ ...newPackage, duration_days: Number(event.currentTarget.value) });
            return
        }
        setNewPackage({ ...newPackage, [event.currentTarget.name]: event.currentTarget.value });
    }
    const handlePrice = (event:ChangeEvent<HTMLInputElement>)=>{
        setInputErrors({ ...emptyFields})
        const value = event.currentTarget.value
        const raw = value.replace(/[^0-9]/g, '')
        if (raw === '') {
            setPrice('$')
            return
        }
        const formatPrice = handlePriceFormat(value) as string
        setPrice(formatPrice);
        setNewPackage({...newPackage, price:Number(raw)})
    }
    const handleInputActions = (name:keyof Package, action:boolean)=>{
        setNewPackage(prev => {
            const currentValue = prev[name] as number
            const newValue = action ? currentValue + 1 : Math.max(0, currentValue - 1)

            return {
                ...prev,
                [name]: newValue
            }
        })
    }
    const handleDuration = (event:ChangeEvent<HTMLSelectElement>)=>{
        setTimeInput({dia:false, semana:false, mes:false});
        setTimeInput(prev=>({...prev, [event.target.value]:true}));
        setNewPackage({...newPackage, duration_days:1})
    }
    return <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className='text-2xl font-bold'>Crea un nuevo paquete</h2>
        <label htmlFor="name">
            <strong>Nombre del paquete</strong>
            <p className='font-thin text-red-400'>{inputErrors.name??''}</p>
            <input onChange={handleOnChange} type="text" id='name' name='name' value={newPackage.name} />
        </label>

        <label htmlFor="price">
            <strong>Precio</strong>
            <p className='font-thin text-red-400'>{inputErrors.price??''}</p>
            <input onChange={handlePrice} type="text" id='price' name='price' value={price} />
        </label>

        <label htmlFor="duration_days">
            <div className='flex gap-2'>
                <strong>Vigencia</strong>
            </div>
            <p className='font-thin text-red-400'>{inputErrors.duration_days ?? ''}</p>
            <div className='flex gap-2 items-center justify-start h-full'>
                <select onChange={handleDuration} defaultValue='dia' name="duration" id="duration" style={{width:'auto', borderRadius:15}}>
                    {Object.keys(timeInput).map(elem=><option key={elem}>
                        {elem}
                    </option>)}
                </select>
                <input onChange={handleOnChange} type="number" id='duration_days' name='duration_days' value={newPackage.duration_days} min={0} />
                <button type="button" className="h-10 w-10 px-2 text-gray-500 bg-zinc-100 rounded-lg hover:text-black cursor-pointer" onClick={()=>handleInputActions('duration_days', false)}>-</button>
                <button type="button" className="h-10 w-10 px-2 text-gray-500 hover:text-black cursor-pointer bg-zinc-100 rounded-lg" onClick={()=>handleInputActions('duration_days', true)}>+</button>
            </div>
        </label>

        <label htmlFor="">
            <strong>Grupal</strong>
            <div onClick={handleGroupToggle} className={`relative flex items-center ${!isGroupPackage ? 'bg-zinc-200' : 'bg-green-400'} h-10 w-20 rounded-2xl`}>
                <div className={`absolute flex items-center justify-center h-8 w-8 rounded-xl bg-white transform transition-all duration-300 ease-in-out ${isGroupPackage ? 'translate-x-11' : 'translate-x-[15%]'}`}>
                    <Users2 size={16} className={`${isGroupPackage?'text-green-600':'text-zinc-400'}`}/>
                </div>
            </div>
        </label>
        <div className={`transiton-all duration-300 ease-in-out overflow-y-hidden ${isGroupPackage?'h-20 min-h-20':'h-0 min-h-0'}`}>
            <p className='font-thin text-red-400'>{inputErrors.group_size??''}</p>
            {
            isGroupPackage ? <label htmlFor="group_size">
                <strong>Tamaño del grupo</strong>
                    <div className='flex gap-2 items-center justify-start h-full pl-1'>
                        <input onChange={({ currentTarget: { value } }) => setNewPackage({ ...newPackage, group_size: Number(value) })} type="number" id='group_size' name='group_size' value={newPackage.group_size} min={1} />
                        
                        <button type="button" className="h-10 w-10 px-2 text-gray-500 bg-zinc-100 rounded-lg hover:text-black cursor-pointer"onClick={()=>handleInputActions('group_size', false)}>-</button>

                        <button type="button" className="h-10 w-10 px-2 text-gray-500 hover:text-black cursor-pointer bg-zinc-100 rounded-lg"onClick={()=>handleInputActions('group_size', true)}>+</button>

                    </div>
                </label> : null
            }
        </div>

        <label htmlFor="benefits">
            <div className='flex flex-wrap gap-1'>
                {
                    newPackage.benefits?.map((elem, index) => <p className='relative group text-indigo-300 bg-indigo-50 w-fit max-w-full px-2 rounded-sm border border-dotted cursor-pointer hover:bg-red-50 hover:text-red-300 wrap-break-word' key={`${elem}-${index}`}>
                        <X onClick={() => setNewPackage({ ...newPackage, benefits: newPackage.benefits.filter(b => b !== elem) })} className='absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 bg-red-100 rounded-2xl p-1 z-10' size={20} />
                        {elem}
                    </p>)
                }
            </div>
            <strong>Beneficios</strong>
            <input onKeyDown={(e) => {
                // e.preventDefault()
                if (newPackage.benefits.length > 10) return
                if (e.key === "Enter" && e.currentTarget.value !== "") {
                    e.preventDefault()
                    setNewPackage({ ...newPackage, benefits: [...newPackage.benefits, e.currentTarget.value] })
                    e.currentTarget.value = ""
                }

            }} type="text" id='benefits' name='benefits' />
        </label>
        <div className='w-full flex justify-end gap-2'>
            <button onClick={()=>{
                setShowNewPackageForm(false)
                _setNewPackage({
                    id: undefined,
                    name: '',
                    price: 0,
                    benefits: [],
                    duration_days: 0,
                    group_size: 1,
                    is_active: true,
                })
            }} className='px-6 py-2 w-fit cursor-pointer rounded-md border-2 font-semibold text-zinc-600'>Cancelar</button>
            {
                _package.id?<button className='px-6 py-2 w-fit cursor-pointer rounded-md font-black bg-indigo-400 text-white'>Aceptar</button>:<button className='px-6 py-2 w-fit cursor-pointer rounded-md font-black bg-indigo-400 text-white'>Crear paquete</button>
            }
        </div>
    </form>
}
export default NewPackageForm;