import ThemeChanger from './ThemeChanger'
import Logout from './Logout'
import DeleteAccount from './DeleteAccount'
import TwitterBlue from './TwitterBlue'
export default function Settings(){
    return (
        <section id="settings" className="w-[90%] mx-auto mt-8 space-y-7">
        <ThemeChanger />
        <Logout />
        <DeleteAccount />
        <TwitterBlue/>
      </section>
    )
}
