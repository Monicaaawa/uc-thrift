import './Searchbar.css';

const Searchbar = ({ onSearch }) => {
    const handleChange = async (e) => {
        const target = e.target.value.toLowerCase(); 

        try {
            onSearch(target);
        } catch (error) {
            console.log("Error fetching items: ", error); 
        }
    };
    return (
        <>
            <div className='search-container'>
                <input 
                    className="search"
                    type="text"
                    placeholder="Search here"
                    onChange={handleChange}
                />
                <img className="search-icon" src="../../../src/assets/searchbarIcon.svg" alt="search icon" />
            </div>
        </>
    );
};

export default Searchbar;
