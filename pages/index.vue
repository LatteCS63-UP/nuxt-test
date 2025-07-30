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
                    color="primary"
                    :min="0"
                ></v-number-input>
            </v-col>
            <v-col cols="12" md="2" class="pb-0">
                <v-text-field
                    density="compact"
                    v-model="search.market"
                    label="Market"
                    variant="outlined"
                    color="primary"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="pb-0">
                <v-btn variant="tonal" class="text-none !font-semibold" height="40px" color="primary" @click="searchClick" block>Search</v-btn>
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
                    <v-radio label="Local" value="local" color="primary"></v-radio>
                    <v-radio label="Global" value="global" color="primary"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
        
        <div v-if="item.holidayType" class="flex gap-x-2.5">
            <div>
                <DatePicker 
                v-model.range="date"
                :rows="2" :columns="3" 
                :initial-page="{ month: 1, year: item.year }" 
                :min-page="{ month: 1, year: item.year }"
                :max-page="{ month: 12, year: item.year }"
                :min-date="new Date()"
                :key="item.year"
                :attributes="rangeAttributes"
                :disabled-dates="disabledDates"
                :is-range="false"
                @dayclick="handleDayClick"/>
            </div>

            <div class="w-full flex flex-col justify-between">
                <div>
                    <v-table
                        fixed-header
                        class="border max-h-[318px]"
                        :class="holidayDate.length > 0 ? '!rounded-md' : ''"
                    >
                        <thead>
                            <tr>
                                <th class="text-center font-weight-bold bg-blue">Date<span class="font-medium"> (DD/MM/YYYY)</span></th>
                                <th class="text-left border-s-sm font-weight-bold bg-blue">Can trade?</th>
                                <th class="text-left border-s-sm font-weight-bold bg-blue">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-if="holidayDate.length > 0"
                                v-for="item in holidayDate"
                                :key="formatDate(item.date)"
                            >
                                <td class="text-center" :class="status.confirm ? 'bg-grey-lighten-5' : ''">{{ formatDate(item.date) }}</td>
                                <td class="border-s-sm" :class="status.confirm ? 'bg-grey-lighten-5' : ''">
                                    <v-select
                                        v-model="item.canTrade"
                                        :items="['Y', 'N', 'X']"
                                        density="compact"
                                        variant="underlined"
                                        :readonly="status.confirm"
                                        hide-details
                                    />
                                </td>
                                <td class="border-s-sm" :class="status.confirm ? 'bg-grey-lighten-5' : ''">
                                    <v-text-field
                                        v-model="item.description"
                                        density="compact"
                                        variant="underlined"
                                        :readonly="status.confirm"
                                        hide-details
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                    <div v-if="holidayDate.length > 0" class="flex justify-end py-2 gap-x-2">
                        <v-btn v-if="!status.confirm" variant="outlined" class="text-none" @click="status.confirm = true">Confirm</v-btn>
                        <v-btn v-else variant="outlined" class="text-none" @click="status.confirm = false">Edit</v-btn>
                        <v-btn variant="outlined" class="text-none" @click="status.dialog_copy = true">Copy</v-btn>
                    </div>
                </div>
                <div>
                    <p class="text-red font-semibold flex justify-center gap-x-2">
                        <span>N = No Trade and Settlement</span>
                        <span>Y = Can Trade and Can Settlement</span>
                        <span>X = Half Day</span>
                    </p>
                </div>
            </div>
        </div>
        <div>
        </div>
        <v-dialog
            v-model="status.dialog_copy"
            max-width="600"
        >
            <v-card>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="4" class="pb-0">
                            <v-number-input
                                density="compact"
                                v-model="copy.year"
                                label="Year"
                                variant="outlined"
                                color="primary"
                                :min="0"
                            ></v-number-input>
                        </v-col>
                        <v-col cols="12" sm="4" class="pb-0">
                            <v-text-field
                                density="compact"
                                v-model="copy.market"
                                label="Market"
                                variant="outlined"
                                color="primary"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="pt-0">
                            <v-radio-group v-model="copy.holidayType" inline>
                                <v-radio label="Local" value="local" color="primary"></v-radio>
                                <v-radio label="Global" value="global" color="primary"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn variant="tonal" class="" color="primary" @click="status.dialog_copy = false">Confirm</v-btn>
                    <v-btn variant="tonal" class="" color="error" @click="cancelCopy">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
        const year = now.getFullYear();
        return {
            date: null as any | null,
            selectedRanges: [] as Range[],
            holidayDate: [] as HolidayDes[],
            tempRange: { start: null, end: null } as { start: Date | null, end: Date | null },
            disabledDates: [{
                repeat: {
                    weekdays: [1, 7]
                }
            }],
            item: {
                year,
                market: 'NASDAQ',
                holidayType: null as string | null,
            },

            copy: {
                year: year + 1,
                market: null as string | null,
                holidayType: null as string | null,
            },

            search: {
                year: now.getFullYear(),
                market: 'NASDAQ',
                holidayType: 'global',
            },

            status: {
                confirm: false,
                dialog_copy: false,
            },

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
                        this.holidayDate = this.holidayDate.filter(item => item.date !== day.date);
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

                this.holidayDate.sort((day1, day2) => {
                    const monthDiff = day1.date.getMonth() - day2.date.getMonth();
                    if (monthDiff !== 0) return monthDiff;

                    return day1.date.getDate() - day2.date.getDate();
                });
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
            this.item = {
                ...this.search
            };

            this.copy = {
                year: this.item.year + 1,
                market: this.item.market,
                holidayType: this.item.holidayType
            };
        },

        cancelCopy() {
            this.status.dialog_copy = false;
            this.copy = {
                year: this.item.year + 1,
                market: this.item.market,
                holidayType: this.item.holidayType
            };
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