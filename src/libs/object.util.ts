// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformQueryToWhere = (query: any, constraint:{key:string;type:string;}[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where :{ [key:string]:any } = {};

    for(let i = 0; i < constraint.length; i++){
        const key = constraint[i];
        if( query[key.key] ){
            if(key.type === 'number'){
                where[key.key] = parseInt(query[key.key].toString(),10);
            }else if(key.type === 'text'){
                where[key.key] = {
                    contains:query[key.key].toString()
                }
            }
        }
    }
    return where;
}