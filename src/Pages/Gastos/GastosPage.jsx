import FiltroBusquedaGastos from "./FiltroBusquedaGastos";
import GastosHeader from "./GastosHeader";
import ResumenGastos from "./ResumenGastos";
import TablaGastos from "./TablaGastos";


export default function GastosPage() {
    return(
        <>
            <GastosHeader/>
            <ResumenGastos/>
            <FiltroBusquedaGastos/>
            <TablaGastos/>
        </>
    )
}