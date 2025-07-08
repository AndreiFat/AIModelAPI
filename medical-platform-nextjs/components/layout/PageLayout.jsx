import React from 'react';

function PageLayout({children}) {
    return (
        <div className={"container mx-auto py-20"}>
            {children}
        </div>
    );
}

export default PageLayout;