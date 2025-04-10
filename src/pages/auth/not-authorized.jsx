const NotAuthorized = () => {
    return ( 
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-[#475569]">403</h1>
                <h1 className="text-3xl font-bold text-[#475569]">You are not authorized to view this page</h1>
            </div>
        </div>
     );
}
 
export default NotAuthorized;