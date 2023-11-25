import Navbar from "../components/navigation/Navbar";
import Searchbar from "../components/search/Searchbar";
import DropdownFilter from "../components/search/DropdownFilter";

function Home()
{
    return (
        <>
            <Navbar />
            <Searchbar />
            <DropdownFilter />
        </>
    )
}

export default Home