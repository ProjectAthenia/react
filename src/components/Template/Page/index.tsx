import React, {HTMLAttributes, PropsWithChildren} from "react";

import "./index.scss"

interface PageProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {}

const Page: React.FC<PageProps>= ({children, className, ...props}) => {

    return (
        <section className={"page " + (className ?? '')} {...props}>
            {children}
        </section>
    )
}

export default Page