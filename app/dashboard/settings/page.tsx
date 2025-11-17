import styles from './styles.module.css';
export default function SettingPage(){
    return <main className="flex flex-col gap-4 h-screen w-[calc(100vw-13em)] p-10">
        <ul className="p-4 border border-zinc-200 rounded-xl">
            <h2 className="font-bold text-2xl">Perfil</h2>
            <li>
                Correo
                <p>email@email.com</p>
            </li>
        </ul>
        <ul className="p-4 border border-zinc-200 rounded-xl">
            <h2 className="font-bold text-2xl">Configuracion</h2>
            <li>
                <p className=''>Eliminarusuario al de vencer suscripción</p>
                <input type="checkbox" className={styles['dlt-user']} id="dlt-user"/>
                <label htmlFor="dlt-user" className={styles.toggle}>
                    <div></div>
                </label>
            </li>

            <li>
                <p className=''>Eliminarusuario al de vencer suscripción</p>
                <input type="checkbox" className={styles['dlt-user']} id="dlt-user"/>
                <label htmlFor="dlt-user" className={styles.toggle}>
                    <div></div>
                </label>
            </li>
        </ul>
    </main>
}