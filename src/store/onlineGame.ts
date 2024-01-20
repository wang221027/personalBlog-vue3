import { defineStore } from 'pinia'
export const onlineGameStore = defineStore('onlineGame', {
    state() {
        return {
            person: {
                width: '200px',
                height: '200px'
            },
            userArr: [] as any[]
        }
    },
    actions: {
        addUser(data:any) {
            console.log(this.userArr.length);
            if(this.userArr.length <= 0) {
                return this.userArr.push({ nickname: data.nickname })
            }
            this.userArr.forEach((item: any) => {
                console.log(item.nickname + '==' + data.nickname);
                if(item.nickname == data.nickname) {
                    console.log('===');
                    return
                }else {
                    this.userArr.push({ nickname: data.nickname })
                }
            })
        }
    }
})