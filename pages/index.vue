<template>
    <!-- <Calendar /> -->
    <v-container width="1400px" class="border">
        <v-row>
            <v-col cols="12" md="2" class="pb-0">
                <v-number-input
                    density="compact"
                    v-model="search.year"
                    label="Year"
                    variant="outlined"
                    :min="0"
                ></v-number-input>
            </v-col>
            <v-col cols="12" md="2" class="pb-0">
                <v-text-field
                    density="compact"
                    v-model="search.market"
                    label="Market"
                    variant="outlined"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="pb-0">
                <v-btn variant="outlined" height="40px" @click="searchClick" block>Search</v-btn>
            </v-col>

            <v-spacer/>
            <v-col cols="12" md="1" class="pb-0">
                <v-btn variant="outlined" class="text-none" height="40px" block>Import file</v-btn>
            </v-col>
            <v-col cols="12" md="1" class="pb-0">
                <v-btn variant="outlined" class="text-none" height="40px" block>Export file</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-radio-group v-model="search.holidayType" inline>
                    <v-radio label="Local" value="local"></v-radio>
                    <v-radio label="Global" value="global"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
        
        <div v-if="holidayType" class="flex gap-x-2.5">
            <div>
                <DatePicker 
                v-model.range="date"
                :rows="4" :columns="3" 
                :initial-page="{ month: 1, year: year }" 
                :min-page="{ month: 1, year: year }"
                :max-page="{ month: 12, year: year }"
                :min-date="new Date()"
                :key="year"
                :attributes="rangeAttributes"
                :disabled-dates="disabledDates"
                :is-range="false"
                @dayclick="handleDayClick"/>
            </div>
            <div class="w-full">
                <v-table
                    fixed-header
                    class="border max-h-[316px]"
                >
                    <thead>
                        <tr>
                            <th class="text-left font-weight-bold">Date</th>
                            <th class="text-left border-s-sm font-weight-bold">canTrade</th>
                            <th class="text-left border-s-sm font-weight-bold">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-if="holidayDate.length > 0"
                            v-for="item in holidayDate"
                            :key="formatDate(item.date)"
                        >
                            <td>{{ formatDate(item.date) }}</td>
                            <td class="border-s-sm">
                                <v-select
                                    v-model="item.canTrade"
                                    :items="['Y', 'N']"
                                    density="compact"
                                    variant="underlined"
                                    hide-details
                                />
                            </td>
                            <td class="border-s-sm">
                                <v-text-field
                                    v-model="item.description"
                                    density="compact"
                                    variant="underlined"
                                    hide-details
                                />
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                <div v-if="holidayDate.length > 0" class="flex justify-end py-2 gap-x-2">
                    <v-btn variant="outlined" class="text-none">Confirm</v-btn>
                    <v-btn variant="outlined" class="text-none">Copy</v-btn>
                </div>
            </div>
        </div>
        <div>
        </div>
        <!-- <v-dialog
            v-model="dialog"
            max-width="400"
            persistent
        >
            <v-card
                prepend-icon="mdi-alert-box"
                title="Use Google's location service?"
                text="Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running."
            >
                <template v-slot:actions>
                    <v-spacer/>
                    <v-btn @click="dialog = false">Yes</v-btn>
                    <v-btn @click="dialog = false">No</v-btn>
                </template>
            </v-card>
        </v-dialog> -->
    </v-container>
</template>

<script lang="ts">
interface Range {
    start: Date
    end: Date
}
interface HolidayDes {
    date: Date
    canTrade: string
    description: string | null
}
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

export default {
    components: {
        Calendar,
        DatePicker
    },
    computed: {
        rangeAttributes() {
            return this.selectedRanges.map((range, i) => ({
                key: `range-${i}`,
                highlight: 'green',
                dates: {
                    start: range.start ? new Date(range.start) : undefined,
                    end: range.end ? new Date(range.end) : undefined
                }
            }));
        },
    },
    data() {
        const now = new Date()
        return {
            date: null as any | null,
            year: now.getFullYear(),
            market: 'NASDAQ',
            holidayType: null as string | null,
            selectedRanges: [] as Range[],
            holidayDate: [] as HolidayDes[],
            tempRange: { start: null, end: null } as { start: Date | null, end: Date | null },
            disabledDates: [{
                repeat: {
                    weekdays: [1, 7]
                }
            }],

            search: {
                year: now.getFullYear(),
                market: 'NASDAQ',
                holidayType: 'global',
            },

            dialog: false
        };
    },
    mounted() {},
    methods: {
        getData() {
            this.selectedRanges.push(
                { start: new Date('2025-04-01'), end: new Date('2025-04-03') },
            )
        },

        allSelectedDates() {
            if(this.holidayDate.length !== 0) {
                this.holidayDate.forEach(day => {
                    if(!this.isRangeOverlapping(day.date, day.date, this.selectedRanges)){
                        this.holidayDate = this.holidayDate.filter(item => item.date !== day.date)
                    }
                })

                this.selectedRanges.forEach(range => {
                    const current = new Date(range.start);
                    const end = new Date(range.end);

                    while(current <= end) {
                        const date_same = this.holidayDate.some(day => {
                            const date_main = current.toISOString().slice(0, 10);
                            const date_check = day.date.toISOString().slice(0, 10);
                            return date_main === date_check;
                        })
                        if(!date_same){
                            this.holidayDate.push(
                                {
                                    date: new Date(current),
                                    canTrade: 'N',
                                    description: null
                                }
                            )
                        }
                        current.setDate(current.getDate() + 1);
                    }
                })
            }else {
                this.selectedRanges.forEach(range => {
                    const current = new Date(range.start);
                    const end = new Date(range.end);
                    
                    while(current <= end) {
                        this.holidayDate.push(
                            {
                                date: new Date(current),
                                canTrade: 'N',
                                description: null
                            }
                        );
                        current.setDate(current.getDate() + 1);
                    }
                })
            }
        },

        handleDayClick(day: any) {
            if (this.date) {
                if(!this.isRangeOverlapping(this.date.start, this.date.end, this.selectedRanges)) {
                    const diffDays = (this.date.start.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    if(diffDays >= 3) {
                        this.selectedRanges.push({ start: this.date.start, end: this.date.end })
                    }

                }else {
                    this.selectedRanges = this.removeOverlappingRanges(this.date.start, this.date.end, this.selectedRanges)

                }
                this.date = null;
                this.tempRange = { start: null, end: null }

            }else {
                const diffDays = (day.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                if(diffDays >= 3) {
                    if(day.weekday !== 1 || day.weekday !== 7) {
                        if (this.tempRange.start && !this.tempRange.end) {
                            const start = this.tempRange.start
                            const end: Date = day.date
                            if(start === end) {
                                if(this.isRangeOverlapping(start, end, this.selectedRanges)) {
                                    this.selectedRanges = this.removeOverlappingRanges(start, end, this.selectedRanges)

                                }
                            }
                            this.tempRange = { start: null, end: null }

                        }else {
                            this.tempRange = { start: day.date, end: null }
                        }
                    }
                }
            }
        },

        isRangeOverlapping(start: Date, end: Date, ranges: { start: Date, end: Date }[]) {
            return ranges.some(range => {
                return !(end < range.start || start > range.end)
            })
        },

        removeOverlappingRanges(start: Date, end: Date, ranges: { start: Date, end: Date }[]) {
            return ranges.filter(range => {
                const holiday = [{ start: range.start, end: range.end }]
                return !this.isRangeOverlapping(start, end, holiday)
            })
        },

        formatDate(date: Date): string {
            const d = date.getDate().toString().padStart(2, '0');
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const y = date.getFullYear();
            return `${d}-${m}-${y}`;
        },

        searchClick() {
            this.year = this.search.year;
            this.market = this.search.market;
            this.holidayType = this.search.holidayType;
        }
    },
    watch: {
        selectedRanges: {
            handler() {
                this.allSelectedDates();
            },
            deep: true
        }
    }
};
</script>

<style>
.vc-container .vc-weekday-1, .vc-container .vc-weekday-7 {
    color: #DB4345;
}
.vc-header .vc-title {
    pointer-events: none;
}
</style>