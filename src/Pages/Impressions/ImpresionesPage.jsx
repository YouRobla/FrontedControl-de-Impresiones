import FiltroBusqueda from "./FiltroBusqueda";
import ImpresionesHeader from "./ImpresionesHeader";
import PreciosImpresion from "./PreciosImpresion";
import TablaImpresiones from "./TablaImpresiones";

export default function ImpresionesPage() {
    return(
        <>
        <ImpresionesHeader/>
        <PreciosImpresion/>
        <FiltroBusqueda/>
        <TablaImpresiones/>
        </>
    )
}