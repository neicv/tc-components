import m from 'mithril';
import DataTable from '@/components/DataTable';
import Switch from '@/components/Switch';

class PaginationDoc {
    oninit() {
        this.desserts = [
            {
                name: 'Frozen Yogurt',
                calories: 159,
                fat: 6.0,
                carbs: 24,
                protein: 4.0,
                iron: '1%',
            },
            {
                name: 'Ice cream sandwich',
                calories: 237,
                fat: 9.0,
                carbs: 37,
                protein: 4.3,
                iron: '1%',
            },
            {
                name: 'Eclair',
                calories: 262,
                fat: 16.0,
                carbs: 23,
                protein: 6.0,
                iron: '7%',
            },
            {
                name: 'Cupcake',
                calories: 305,
                fat: 3.7,
                carbs: 67,
                protein: 4.3,
                iron: '8%',
            },
            {
                name: 'Gingerbread',
                calories: 356,
                fat: 16.0,
                carbs: 49,
                protein: 3.9,
                iron: '16%',
            },
            {
                name: 'Jelly bean',
                calories: 375,
                fat: 0.0,
                carbs: 94,
                protein: 0.0,
                iron: '0%',
            },
            {
                name: 'Lollipop',
                calories: 392,
                fat: 0.2,
                carbs: 98,
                protein: 0,
                iron: '2%',
            },
            {
                name: 'Honeycomb',
                calories: 408,
                fat: 3.2,
                carbs: 87,
                protein: 6.5,
                iron: '45%',
            },
            {
                name: 'Donut',
                calories: 452,
                fat: 25.0,
                carbs: 51,
                protein: 4.9,
                iron: '22%',
            },
            {
                name: 'KitKat',
                calories: 518,
                fat: 26.0,
                carbs: 65,
                protein: 7,
                iron: '6%',
            },
        ]

        this.headers = [
            {
              text: 'Dessert (100g serving)',
              align: 'start',
              sortable: true,
              value: 'name',
              width: 'expand',
              truncate: 'off',
              alignHeader: 'left',
            },
            { text: 'Calories', value: 'calories', sortable: true},
            { text: 'Fat (g)', value: 'fat', width: 'smallest', sortable: true},
            { text: 'Carbs (g)', value: 'carbs', width: 'smallest', sortable: true},
            { text: 'Protein (g)', value: 'protein' , sortable: true},
            { text: 'Iron (%)', value: 'iron' , width: 'smallest', truncate: 'off', sortable: true, searchable: false}
        ]

        this.isRndData = false;
        this.items     = this.desserts;
        this.rndData   = this.generateData();
    }

    onbeforeupdate() {
        this.items = this.isRndData ? [...this.desserts, ...this.rndData] : this.desserts;
    }

    view() {
        return (
            <div className='test-pagination'>
                <p>TEST</p>
                <div className="spacebetween">
                    <p><h2>Data Table</h2></p>
                    <label className="switcher-label-placement-start">
                        <Switch
                            value={this.isRndData}
                            onchange={value=> this.changeData(value)}
                        />
                        <span className={`${this.isRndData ? 'text-primary' : 'text-secondary'} fs12`}>+5000 items</span>
                    </label>
                </div>
                <DataTable items={this.items} headers={this.headers} className="fs14 text-secondary"/>
            </div>
        )
    }

    generateData() {
        let randomData = [];
        for (let i = 1; i <= 5000; i++) {
            randomData.push({
                name: this.desserts[Math.floor(Math.random() * this.desserts.length)].name,
                calories: (Math.random() * 1000).toFixed(),
                fat: (Math.random() * 100).toFixed(1),
                carbs: (Math.random() * 100).toFixed(),
                protein: (Math.random() * 10).toFixed(1),
                iron: (Math.random() * 20).toFixed() + '%',
            });
        }
        return randomData;
    }

    changeData(val) {
        this.isRndData = val;
        setTimeout(() => m.redraw(), 0);
    }
}

export default PaginationDoc;
